import { useParams } from '@solidjs/router'
import { For } from 'solid-js'
import { Assignment } from '../types.tsx'
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
		try {
			return Assignment.getAssignment(assignmentKey)
		} catch (_error) {
			return (
				<div>
					Assignment not found
					<br />
					<a href='/'>Go back</a>
				</div>
			)
		}
	}
	return (
		<div style='text-align: center'>
			<h1>Assignment: {getAssignment()?.title}</h1>
			<For each={getAssignment()?.assignment}>
				{(line) => <textarea value={line} />}
			</For>
		</div>
	)
}
