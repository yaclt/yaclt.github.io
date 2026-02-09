import { Assignment } from './types.tsx'

const assignmentPaths = [
	/*ASSIGNMENT_PATHS_BEGIN*/
	'./assignments/Introduction.tsx',
	/*ASSIGNMENT_PATHS_END*/
]

const imports: Promise<Assignment>[] = []
assignmentPaths.forEach((path) => {
	imports.push(import(path).then((module) => new module.default()))
})

export const assignmentsReady = await Promise.allSettled(imports).then((results) => results.find((result) => result.status === 'rejected') === undefined)
