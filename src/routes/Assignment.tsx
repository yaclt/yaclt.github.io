import { useParams } from '@solidjs/router'
import { createMemo, createSignal, createUniqueId, ErrorBoundary, For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { Assignment, AssignmentNotFoundError, LOCAL_STORAGE_PREFIX_PASSED_ASSIGNMENT, USER_ID } from '../types.tsx'

export default () => {
	const params = useParams()
	const assignment = createMemo(() => {
		const assignmentKey = params.path?.split('/').at(-1) ?? ''
		const assignment = Assignment.getAssignment(assignmentKey)
		const passedAssignment = localStorage.getItem(`${LOCAL_STORAGE_PREFIX_PASSED_ASSIGNMENT}${assignment.hashKey}`)
		if (passedAssignment) {
			const passedAssignmentSegments = JSON.parse(passedAssignment)
			passedAssignmentSegments.code.forEach((segment: string, index: number) => {
				assignment.segments[index * 2 + 1].set(segment)
			})
			setTicks(passedAssignmentSegments.ticks)
			setResult(passedAssignmentSegments.result)
			setPassed(true)
		}
		return assignment
	})
	function error(err: Error) {
		switch (err.constructor) {
			case AssignmentNotFoundError:
				return (
					<div>
						Could not find assignment
						<br />
						<A href='/'>Go back</A>
					</div>
				)
			default:
				return (
					<div>
						An error occurred
						<br />
						<A href='/'>Go back</A>
					</div>
				)
		}
	}
	function validate(value: string, set: (value: string) => void) {
		set(value)
		const a = assignment()
		if (!a) return
		const v = a.validate()
		setResult(v.error || v.result)
		setTicks(v.ticks)
		setPassed(v.passed)
		if (v.passed) {
			const userTicks = ticks().filter((_t, index) => index % 2).reduce((a, b) => a + b, 0)
			fetch(`https://docs.google.com/forms/d/e/1FAIpQLSf8sJDTIXh8UXZzQUVkVBDMayUCrTg4fThHBJg2JNqn37dxyg/formResponse?entry.377919147=${USER_ID}&entry.850045796=${a.key.id}&entry.1964957096=${userTicks}&submit=Submit`, {
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
	}
	const [result, setResult] = createSignal()
	const [ticks, setTicks] = createSignal<number[]>([])
	const [passed, setPassed] = createSignal(false)
	return (
		<div style='text-align: center'>
			<ErrorBoundary fallback={error}>
				<h1>Assignment: {assignment()?.title}</h1>
				<div style='display: flex; flex-direction: column;'>
					<div>
						<p>Time taken: {ticks().filter((_t, index) => index % 2).reduce((a, b) => a + b, 0)} ticks ({ticks().reduce((a, b) => a + b, 0)} total)</p>
					</div>
					<ErrorBoundary fallback={error}>
						<For each={assignment()?.segments}>
							{(segment, index) => (
								<div style='display: flex; gap: 1rem; width: 100%;'>
									<textarea id={createUniqueId()} disabled={index() % 2 === 0} value={segment.get()} onInput={(e) => validate(e.target.value, segment.set)} />
									<Show when={ticks()[index()]}>
										<i>{ticks()[index()]}</i>
									</Show>
								</div>
							)}
						</For>
						<p>
							<Show when={passed()}>
								✅
							</Show>
							Result:&nbsp;<output>{result()?.toString()}</output>
						</p>
					</ErrorBoundary>
				</div>
			</ErrorBoundary>
		</div>
	)
}
