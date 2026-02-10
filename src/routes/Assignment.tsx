import { useParams } from '@solidjs/router'
import { createMemo, createSignal, createUniqueId, ErrorBoundary, For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { Assignment, AssignmentNotFoundError } from '../types.tsx'

export default () => {
	const params = useParams()
	const assignment = createMemo(() => {
		const assignmentKey = params.path?.split('/').at(-1) ?? ''
		return Assignment.getAssignment(assignmentKey)
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
		setPassed(v.passed)
		setTicks(v.ticks)
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
						<p>Time taken: {ticks().filter((_t, index) => index % 2 === 1).reduce((a, b) => a + b, 0)} ticks ({ticks().reduce((a, b) => a + b, 0)} total)</p>
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
							Result:
							<output>{result()?.toString()}</output>
						</p>
					</ErrorBoundary>
				</div>
			</ErrorBoundary>
		</div>
	)
}
