import { A } from '@solidjs/router'
import { For } from 'solid-js'
import { Assignment } from '../types.tsx'

export default () => {
	const groupedAssignments: Record<string, Record<string, Assignment[]>> = {}
	Assignment.assignments.forEach((assignment) => {
		if (!groupedAssignments[assignment.language]) {
			groupedAssignments[assignment.language] = {
				[assignment.label]: [assignment],
			}
		} else {
			groupedAssignments[assignment.language][assignment.label] = [...(groupedAssignments[assignment.language][assignment.label] || []), assignment]
		}
	})
	return (
		<div style='width: fit-content; margin-left: auto; margin-right: auto;'>
			<h1 style='text-align: center;'>Assignments</h1>
			<For each={Object.entries(groupedAssignments)}>
				{([language, labels]) => (
					<ol>
						<h2>{language}</h2>
						<For each={Object.entries(labels)}>
							{([label, assignments]) => (
								<li>
									<h3>{label}</h3>
									<ol>
										<For each={assignments}>
											{(assignment) => (
												<li>
													<A href={`/Assignment/${assignment.language.replaceAll(' / ', '-')}/${assignment.label}/${assignment.title}/${assignment.key}`}>{assignment.title}</A>
												</li>
											)}
										</For>
									</ol>
								</li>
							)}
						</For>
					</ol>
				)}
			</For>
		</div>
	)
}
