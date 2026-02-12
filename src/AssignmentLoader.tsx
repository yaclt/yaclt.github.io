import { Assignment, Label, LOCAL_STORAGE_PREFIX_PASSED_ASSIGNMENT, PASSED_ASSIGNMENTS_BEFORE_CURRENT_SESSION } from './types.tsx'

async function hash(string: string) {
	const encoder = new TextEncoder()
	const data = encoder.encode(string)
	const hash = await crypto.subtle.digest('SHA-1', data)
	return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function getHashKey(assignment: Assignment) {
	const payload = [assignment.id.id, ...assignment.segments.filter((_s, index) => index % 2 === 0).map((segment) => segment.get())]
	return await hash(payload.join('\n'))
}

const imports: Promise<Assignment>[] = []
const labels: Record<string, Label> = {}
const prerequisitesRaw: Record<string, string[]> = {}
const prerequisites: Record<string, Label[]> = {}
const assignmentFetch = fetch('/assignments.json').then((response) => response.json()).then((data) => {
	data.forEach((item) => {
		item.labels.forEach((labelData) => {
			const prerequisitesArray: Label[] = []
			const label = new Label(labelData.name, prerequisitesArray)
			labels[labelData.id] = label
			prerequisitesRaw[labelData.id] = labelData.prerequisites
			prerequisites[labelData.id] = prerequisitesArray
			labelData.assignments.forEach(async (assignmentData) => {
				let resolve = (a: Assignment): void => {
					a // Dummy function
				}
				imports.push(
					new Promise((r) => {
						resolve = r
					}),
				)
				const assignment = new Assignment(assignmentData.id, item.language, label, assignmentData.title, assignmentData.content, assignmentData.answer)
				assignment.hashKey = await getHashKey(assignment)
				if (localStorage.getItem(LOCAL_STORAGE_PREFIX_PASSED_ASSIGNMENT + assignment.hashKey)) {
					PASSED_ASSIGNMENTS_BEFORE_CURRENT_SESSION.push(assignment)
				}
				if (resolve) {
					resolve(assignment)
				}
			})
		})
	})
})

export const assignmentsReady = await Promise.allSettled([assignmentFetch, ...imports]).then((results) => {
	const rejected = results.find((result) => result.status === 'rejected')
	if (rejected === undefined) {
		Object.entries(prerequisitesRaw).forEach(([id, prerequisiteIds]) => {
			const prerequisiteArray = prerequisites[id]
			prerequisiteIds.forEach((prerequisiteId) => {
				const prerequisiteLabel = labels[prerequisiteId]
				prerequisiteArray.push(prerequisiteLabel)
			})
		})
		return true
	}
	throw new Error(`Failed to load assignment: ${rejected.reason.message}`)
})
