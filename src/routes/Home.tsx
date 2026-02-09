import { Assignment } from '../types.tsx'

export default () => {
	return (
		<div style='text-align: center'>
			<h1>Home</h1>
			<ul>
				{Assignment.assignments.map((assignment) => (
					<li>
						<a href={`/Assignment/${assignment.language.replaceAll(' / ', '-')}/${assignment.label}/${assignment.title}/${assignment.key}`}>{assignment.title}</a>
					</li>
				))}
			</ul>
		</div>
	)
}
