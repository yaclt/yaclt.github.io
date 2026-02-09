import { useParams } from '@solidjs/router'
import { Assignment } from '../types.tsx'

export default () => {
	function getAssignment() {
		const assignmentKey = useParams().path?.split('/').at(-1) ?? ''
		try {
			return Assignment.getAssignment(assignmentKey).title
		} catch (error) {
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
			<h1>Assignment: {getAssignment()}</h1>
		</div>
	)
}
