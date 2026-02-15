import { useParams } from '@solidjs/router'
import { createSignal, For, Show } from 'solid-js'

export default () => {
	const params = useParams()
	const assignmentPaths = params.assignmentPaths?.split(',') ?? []
	const promises: Promise<string>[] = []
	const [assignmentErrors, setAssignmentErrors] = createSignal<Record<string, string[]>>({})
	assignmentPaths.forEach((path) => {
		promises.push(
			fetch(path).then((response) => response.json()).catch((error) => {
				setAssignmentErrors((errors) => ({ ...errors, [error.message]: [...(errors[error.message] ?? []), path] }))
				throw error
			}).then(() => path),
		)
	})

	Promise.allSettled(promises).then((results) => {
		const customAssignments = JSON.parse(localStorage.getItem('CustomAssignments') ?? '[]')
		results.forEach((result) => {
			if (result.status === 'fulfilled') {
				if (customAssignments.includes(result.value)) {
					return
				}
				customAssignments.push(result.value)
			}
		})
		localStorage.setItem('CustomAssignments', JSON.stringify(customAssignments))
		if (Object.keys(assignmentErrors()).length === 0) {
			location.href = '/'
		}
	})

	return (
		<div>
			<h1>Custom Assignments</h1>
			<Show when={Object.keys(assignmentErrors()).length === 0}>
				<div>Loading...</div>
			</Show>
			<For each={Object.entries(assignmentErrors())}>
				{([error, paths]) => (
					<div>
						{error}
						<br />
						<For each={paths}>
							{(path) => (
								<div>
									{path}
								</div>
							)}
						</For>
					</div>
				)}
			</For>
		</div>
	)
}
