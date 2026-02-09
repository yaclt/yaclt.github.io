import { useParams } from '@solidjs/router'
import { ErrorBoundary, For } from 'solid-js'
import { A } from '@solidjs/router'
import { Assignment, AssignmentNotFoundError } from '../types.tsx'
import { Agent, CreateDataProperty, Get, ManagedRealm, setSurroundingAgent, Value } from '@magic-works/engine262'

export default () => {
	false || CreateDataProperty || Get || Value
	let tick = 0
	setSurroundingAgent(
		new Agent({
			onNodeEvaluation() {
				tick++
			},
		}),
	)

	const realm = new ManagedRealm({})
	realm.evaluateScript('1 + 1')
	console.log(realm.evaluateScript('1 + 1').Value.value)
	function getAssignment() {
		const assignmentKey = useParams().path?.split('/').at(-1) ?? ''
		return Assignment.getAssignment(assignmentKey)
	}
	function updateSegment(index: number, value: string) {
		setAssignments((store) => {
			const newStore = [...store]
			newStore[index] = value
			return newStore
		})
	}
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
	return (
		<div style='text-align: center'>
			<ErrorBoundary fallback={error}>
				<h1>Assignment: {getAssignment()?.title}</h1>
				<div style='display: flex; flex-direction: column; gap: 1rem;'>
					<div>
						<p>Time taken: {tick} ticks</p>
					</div>
					<ErrorBoundary fallback={error}>
						<For each={getAssignment()?.segments}>
							{(line, index) => <textarea disabled={index() % 2 === 0} value={line()} />}
						</For>
						<output>
							<p>Answer: {getAssignment()?.validate('answer')}</p>
						</output>
					</ErrorBoundary>
				</div>
			</ErrorBoundary>
		</div>
	)
}
