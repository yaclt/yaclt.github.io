import { useParams } from '@solidjs/router'
import { Assignment } from '../types.tsx'

export default () => {
	function getAssignment() {
		return Assignment.getAssignment(useParams().assignment ?? '').title
	}
	return (
		<div style='text-align: center'>
			<h1>Assignment: {getAssignment()}</h1>
		</div>
	)
}
