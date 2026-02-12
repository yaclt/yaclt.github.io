import { Assignment, LOCAL_STORAGE_PREFIX_PASSED_ASSIGNMENT, PASSED_ASSIGNMENTS_BEFORE_CURRENT_SESSION } from './types.tsx'

async function hash(string: string) {
	const encoder = new TextEncoder()
	const data = encoder.encode(string)
	const hash = await crypto.subtle.digest('SHA-1', data)
	return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

const assignmentPaths = [
	/*ASSIGNMENT_PATHS_BEGIN*/
	'./assignments/For.tsx',
	'./assignments/Introduction.tsx',
	/*ASSIGNMENT_PATHS_END*/
]

async function getHashKey(assignment: Assignment) {
	const payload = [assignment.key.id, ...assignment.segments.filter((_s, index) => index % 2 === 0).map((segment) => segment.get())]
	return await hash(payload.join('\n'))
}

const imports: Promise<Assignment>[] = []
assignmentPaths.forEach((path) => {
	imports.push(
		import(path).then(async (module) => {
			const assignment = new module.default()
			assignment.hashKey = await getHashKey(assignment)
			if (localStorage.getItem(LOCAL_STORAGE_PREFIX_PASSED_ASSIGNMENT + assignment.hashKey)) {
				PASSED_ASSIGNMENTS_BEFORE_CURRENT_SESSION.push(assignment)
			}
			return assignment
		}),
	)
})

export const assignmentsReady = await Promise.allSettled(imports).then((results) => {
	const rejected = results.find((result) => result.status === 'rejected')
	if (rejected === undefined) {
		return true
	}
	throw new Error(`Failed to load assignment: ${rejected.reason.message}`)
})
