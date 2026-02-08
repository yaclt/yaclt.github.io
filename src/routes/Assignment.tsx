import { useParams } from "@solidjs/router";

export default () => {
	function getAssignment() {
		return useParams().assignment;
	}
	return (
		<div style="text-align: center">
			<h1>Assignment</h1>
			<h2>Author: {getAssignment()}</h2>
		</div>
	);
};
