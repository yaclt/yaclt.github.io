import { A } from '@solidjs/router'
import { type Accessor, createSignal, For, Show } from 'solid-js'
import { Assignment, Label, PASSED_ASSIGNMENTS_BEFORE_CURRENT_SESSION } from '../types.tsx'

function getPassedAssignments() {
	return Assignment.flat().filter((assignment) => assignment.passed)
}
const passedAssignments = getPassedAssignments()
const passedAssignmentsSignals: Record<string, [Accessor<boolean>, (value: boolean) => void]> = {}
function passedAssignmentWatcher() {
	try {
		const newPassedAssignments = getPassedAssignments().filter((assignment) => !passedAssignments.includes(assignment))
		newPassedAssignments.forEach((assignment) => {
			if (passedAssignmentsSignals[assignment.hashKey]) {
				passedAssignmentsSignals[assignment.hashKey][1](true)
			}
		})
		passedAssignments.push(...newPassedAssignments)
	} catch (error) {
		console.error(error)
	}
	requestAnimationFrame(passedAssignmentWatcher)
}
passedAssignmentWatcher()

export default () => {
	function init(todo: boolean) {
		const result: Record<string, Record<string, Assignment[]>> = {}
		Object.entries(Assignment.assignments).filter(([language, labels]) => {
			Object.keys(labels).forEach((label) => {
				labels[label].forEach((assignment) => {
					if (PASSED_ASSIGNMENTS_BEFORE_CURRENT_SESSION.includes(assignment) !== todo) {
						if (!result[language]) {
							result[language] = {}
						}
						if (!result[language][label]) {
							result[language][label] = []
						}
						result[language][label].push(assignment)
					}
				})
			})
		})
		return Object.entries(result)
	}

	function passed(assignment: Assignment) {
		if (passedAssignmentsSignals[assignment.hashKey]) {
			return passedAssignmentsSignals[assignment.hashKey][0]
		}
		const [passed, setPassed] = createSignal(passedAssignments.includes(assignment))
		passedAssignmentsSignals[assignment.hashKey] = [passed, setPassed]
		return passed
	}
	return (
		<div style='width: fit-content; margin-left: auto; margin-right: auto; display: flex; flex-direction: row; gap: 10rem;'>
			<For each={[true, false]}>
				{(todo) => (
					<div style='display: block;'>
						<Show when={todo}>
							<h1 style='text-align: center;'>Assignments</h1>
						</Show>
						<Show when={!todo}>
							<h1 style='text-align: center;'>Passed Assignments</h1>
						</Show>
						<For each={init(todo)}>
							{([language, labels]) => (
								<>
									<h2>{language}</h2>
									<ol classList={{ reverse: todo }}>
										<For each={Object.entries(labels).sort((a, b) => Label.getSortNumber(a[0]) - Label.getSortNumber(b[0]))}>
											{([label, assignments]) => (
												<Show when={Label.getByName(label)?.isUnlocked}>
													<li classList={{ reverse: todo }}>
														<h3>{label}</h3>
														<ol>
															<For each={assignments}>
																{(assignment) => (
																	<li classList={{ passed: passed(assignment)() }}>
																		<A href={`/Assignment/${assignment.language.replaceAll(' / ', '-')}/${assignment.label}/${assignment.title}/${assignment.key}`}>{assignment.title}</A>
																	</li>
																)}
															</For>
														</ol>
													</li>
												</Show>
											)}
										</For>
									</ol>
								</>
							)}
						</For>
					</div>
				)}
			</For>
		</div>
	)
}
