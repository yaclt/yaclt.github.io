import { Assignment } from '../types.tsx'
import { Introduction } from '../types.tsx'

const content = [
	`/**
 * Hello World 🧑‍💻
 *
 * This is a simple introductory assignment to get you started with Yaclt (Yet another code learning tool).
 * This assignment is easy. You just need to add two numbers (a and b) and assign the result to the 'answer' variable. Do it however you want.
 */
const a = 1
const b = 2
let answer = 0`,
	'answer = ',
	`a + b == answer`,
]

export default class extends Assignment {
	constructor() {
		super('b78b6e6e-5d21-41dd-91d2-1ab23dbb1625', 'JavaScript / TypeScript', Introduction, 'Introduction', content, true)
	}
}
