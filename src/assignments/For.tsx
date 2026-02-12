import { Assignment } from '../types.tsx'
import { JS_Fundamentals } from '../types.tsx'

const content = [
	`/**
 * Hello World 🧑‍💻
 *
 * The "for" loop is a loop that can be used to iterate over a range of values.
 * 
 * The "i" variable is the counter variable. It is initialized to 0 and incremented by 1 on each iteration.
 * The "i < 10" condition is the condition that must be true in order to continue the loop.
 * The "i++" statement is the increment statement. It is executed after each iteration.
 * 
 * The loop below could be read as: for as long as "i < 10", do the code inside the loop, and then increment "i" by 1 (i++).
 */

let answer = 0
for (let i = 0; i < 10; i++) {`,
	'\tanswer += ',
	`}

answer == 10`,
]

export default class extends Assignment {
	constructor() {
		super('2c88fa31-58d3-44c5-b94d-639a4ddf1056', 'JavaScript / TypeScript', JS_Fundamentals, 'The "for" loop', content, true)
	}
}
