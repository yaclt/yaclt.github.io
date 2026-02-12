import { Assignment, LOCAL_STORAGE_PREFIX_PASSED_ASSIGNMENT, PASSED_ASSIGNMENTS_BEFORE_CURRENT_SESSION } from './types.tsx'

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
const assignmentFetch = fetch('/assignments.json').then((response) => response.json()).then((data) => {
	data.forEach((item) => {
		item.labels.forEach((label) => {
			label.assignments.forEach(async (assignment) => {
				let resolve = (a: Assignment): void => {
					a // Dummy function
				}
				imports.push(
					new Promise((r) => {
						resolve = r
					}),
				)
				const a = new Assignment(assignment.id, item.language, label, assignment.title, assignment.content, assignment.answer)
				a.hashKey = await getHashKey(a)
				if (localStorage.getItem(LOCAL_STORAGE_PREFIX_PASSED_ASSIGNMENT + a.hashKey)) {
					PASSED_ASSIGNMENTS_BEFORE_CURRENT_SESSION.push(assignment)
				}
				if (resolve) {
					resolve(a)
				}
			})
		})
	})
})

export const assignmentsReady = await Promise.allSettled([assignmentFetch, ...imports]).then((results) => {
	const rejected = results.find((result) => result.status === 'rejected')
	if (rejected === undefined) {
		return true
	}
	throw new Error(`Failed to load assignment: ${rejected.reason.message}`)
})
