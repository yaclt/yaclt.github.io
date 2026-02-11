import { Assignment, LOCAL_STORAGE_PREFIX_PASSED_ASSIGNMENT, PASSED_ASSIGNMENTS_BEFORE_CURRENT_SESSION } from './types.tsx'
import { encodeHex } from '@std/encoding'

const assignmentPaths = [
	/*ASSIGNMENT_PATHS_BEGIN*/
	'./assignments/Introduction.tsx',
	/*ASSIGNMENT_PATHS_END*/
]

async function getHashKey(assignment: Assignment) {
	const payload = [assignment.key.id, ...assignment.segments.filter((_s, index) => index % 2 === 0).map((segment) => segment.get())]
	const messageBuffer = new TextEncoder().encode(payload.join('\n'))
	const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer)
	const hash = encodeHex(hashBuffer)
	return hash
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
