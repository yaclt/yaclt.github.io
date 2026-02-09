import { A } from '@solidjs/router'
import { Assignment } from '../types.tsx'

export default () => {
	return (
		<div style='width: fit-content; margin-left: auto; margin-right: auto;'>
			<h1 style='text-align: center;'>Assignments</h1>
			<ul style='padding-inline-start: 1ex;'>
				{Assignment.assignments.map((assignment) => (
					<li>
						<A href={`/Assignment/${assignment.language.replaceAll(' / ', '-')}/${assignment.label}/${assignment.title}/${assignment.key}`}>{assignment.title}</A>
					</li>
				))}
			</ul>
		</div>
	)
}
