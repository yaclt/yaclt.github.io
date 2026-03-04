import { useParams } from '@solidjs/router'
import { createMemo, createSignal, ErrorBoundary, For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { Assignment, AssignmentNotFoundError, LOCAL_STORAGE_PREFIX_PASSED_ASSIGNMENT, type Pass, USER_ID } from '../types.tsx'
import { basicSetup, EditorView } from 'codemirror'
import { javascript, javascriptLanguage, scopeCompletionSource } from '@codemirror/lang-javascript'
import readOnlyRangesExtension from 'codemirror-readonly-ranges'

export default () => {
	const params = useParams()
	const [result, setResult] = createSignal()
	const [ticks, setTicks] = createSignal<number[]>([])
	const [passed, setPassed] = createSignal<Pass>('no')
	const [prefixLines, setPrefixLines] = createSignal(0)
	const [suffixLines, setSuffixLines] = createSignal(0)
	const [prefixChars, setPrefixChars] = createSignal(0)
	const [suffixChars, setSuffixChars] = createSignal(0)
	const assignment = createMemo(() => {
		const assignmentKey = params.path?.split('/').at(-1) ?? ''
		const assignment = Assignment.getAssignment(assignmentKey)
		setPrefixLines(assignment.segments[0].get().split('\n').length)
		setSuffixLines(assignment.segments.filter((_s, index) => 1 < index).map((s) => s.get()).join('\n').split('\n').length)
		setPrefixChars(assignment.segments[0].get().length + 1)
		setSuffixChars(assignment.segments.filter((_s, index) => 1 < index).map((s) => s.get()).join('\n').length + 1)

		const passedAssignment = localStorage.getItem(`${LOCAL_STORAGE_PREFIX_PASSED_ASSIGNMENT}${assignment.hashKey}`)
		if (passedAssignment) {
			const passedAssignmentSegments = JSON.parse(passedAssignment)
			passedAssignmentSegments.code.forEach((segment: string, index: number) => {
				assignment.segments[index * 2 + 1].set(segment)
			})
			setTicks(passedAssignmentSegments.ticks)
			setResult(passedAssignmentSegments.result)
			setPassed('yes')
		} else {
			setTicks(assignment.segments.map(() => -1))
		}
		return assignment
	})
	const editor = new EditorView({
		doc: assignment()?.segments.map((s) => s.get()).join('\n'),
		extensions: [
			basicSetup,
			javascript(),
			javascriptLanguage.data.of({
				autocomplete: scopeCompletionSource(globalThis),
			}),
			readOnlyRangesExtension((targetState) => {
				return [
					{
						from: undefined,
						to: targetState.doc.line(prefixLines()).to,
					},
					{
						from: targetState.doc.line(targetState.doc.lines - suffixLines() + 1).from,
						to: undefined,
					},
				]
			}),
			EditorView.updateListener.of((update) => {
				if (!update.docChanged) return
				const doc = update.state.doc.toString()
				const a = assignment()
				if (!a) return
				const userCode = doc.slice(prefixChars(), -suffixChars())
				a.segments[1].set(userCode)
				validate()
			}),
		],
	})
	function error(err: Error) {
		switch (err.constructor) {
			case AssignmentNotFoundError:
				return (
					<div class='error-box'>
						<p>Could not find this assignment.</p>
						<A href='/'>Go back to Home</A>
					</div>
				)
			default:
				return (
					<div class='error-box'>
						<p>Something went wrong.</p>
						<A href='/'>Go back to Home</A>
					</div>
				)
		}
	}
	function updateCodeCells() {
		const codeCells = [...document.getElementsByClassName('code-cell')] as HTMLElement[]
		const tickCells = [...document.getElementsByClassName('tick-cell')] as HTMLElement[]
		codeCells.forEach((codeCell, index) => {
			const tickCell = tickCells[index + 1]
			if (!tickCell) return
			codeCell.style.height = ''
			tickCell.style.height = ''
			if (index === 0 && codeCell.parentElement) {
				codeCell.parentElement.style.marginTop = `${tickCell.clientHeight}px`
			}
			tickCell.style.height = `${codeCell.clientHeight}px`
		})
	}
	setTimeout(updateCodeCells)
	let nextValidation = Promise.resolve()
	let latestValidationId = 0
	async function validate() {
		updateCodeCells()
		const a = assignment()
		if (!a) return
		const myId = ++latestValidationId
		await nextValidation
		if (myId !== latestValidationId) return
		nextValidation = a.validate().then((v) => {
			if (myId !== latestValidationId) return
			setResult(v.error || v.result)
			setTicks(v.ticks)
			setPassed(v.passed)
			if (v.passed === 'yes') {
				const userTicks = ticks().filter((_t, index) => index % 2).reduce((a, b) => a + b, 0)
				const allTicks = ticks().reduce((a, b) => a + b, 0)
				fetch(`https://docs.google.com/forms/d/e/1FAIpQLSf8sJDTIXh8UXZzQUVkVBDMayUCrTg4fThHBJg2JNqn37dxyg/formResponse?entry.377919147=${USER_ID}&entry.850045796=${a.id.id}&entry.1964957096=${userTicks}&entry.1220465795=${allTicks}&submit=Submit`, {
					method: 'GET',
					mode: 'no-cors',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				})
				localStorage.setItem(
					`${LOCAL_STORAGE_PREFIX_PASSED_ASSIGNMENT}${a.hashKey}`,
					JSON.stringify({
						code: a.segments.filter((_s, index) => index % 2).map((s) => s.get()),
						ticks: v.ticks,
						result: v.result,
					}),
				)
			}
		})
	}
	return (
		<div class='assignment-page'>
			<ErrorBoundary fallback={error}>
				<h1>{assignment()?.title}</h1>
				<div class='assignment-meta'>
					<span>
						Time: {ticks().filter((t, index) => index % 2 && 0 < t).reduce((a, b) => a + b, 0)} ticks
					</span>
					<span>
						Total: {ticks().filter((t) => 0 < t).reduce((a, b) => a + b, 0)} ticks
					</span>
				</div>
				<ErrorBoundary fallback={error}>
					<div class='code-grid'>
						<div class='code-cells'>
							{editor.dom}
						</div>
						<div class='tick-cells'>
							<div class='tick-cell'>Ticks</div>
							<For each={ticks()}>
								{(tick) => (
									<Show when={0 <= tick}>
										<div class='tick-cell'>
											{tick}
										</div>
									</Show>
								)}
							</For>
						</div>
					</div>
					<div class='result-area' classList={{ success: passed() === 'yes', partial: passed() === 'partial' }}>
						<p style='margin: 0;'>
							<Show when={passed() === 'yes'}>
								<span aria-hidden='true'>✅</span> Passed —{' '}
							</Show>
							<Show when={passed() === 'partial'}>
								<span aria-hidden='true'>🟡</span> Partial pass, answer is not generic —{' '}
							</Show>
							Result:<output style='display: inline-flex; margin-left: 0.55em; white-space: pre-wrap;'>{result()?.toString()}</output>
						</p>
					</div>
					<Show when={passed() === 'yes'}>
						<div class='assignment-actions'>
							<A href='/' class='btn btn-primary'>Back to Home</A>
						</div>
					</Show>
				</ErrorBoundary>
			</ErrorBoundary>
		</div>
	)
}
