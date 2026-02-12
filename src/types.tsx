import { createStore } from 'solid-js/store'
import { createSignal } from 'solid-js'
import type { Accessor } from 'solid-js'
import { Engine262 } from './Engine262.tsx'

export const LOCAL_STORAGE_PREFIX_PASSED_ASSIGNMENT = 'passed_assignment_:'
export const PASSED_ASSIGNMENTS_BEFORE_CURRENT_SESSION: Assignment[] = []
export type Language = 'JavaScript / TypeScript'

export const USER_ID = localStorage.getItem('USER_ID') ?? crypto.randomUUID()
localStorage.setItem('USER_ID', USER_ID)
fetch(`https://docs.google.com/forms/d/e/1FAIpQLSdefkSHYqvtUU2r-Yv-co-izV2bRvwNqGX138fjLiO-vaP-Yw/formResponse?entry.2045721106=${USER_ID}&submit=Submit`, {
	method: 'GET',
	mode: 'no-cors',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	},
})

class UniqueID {
	static #unique: string[] = []

	private _id: string
	get id() {
		return this._id
	}

	constructor(id: string) {
		if (UniqueID.#unique.includes(id)) {
			throw new Error('ID already exists')
		}
		UniqueID.#unique.push(id)
		this._id = id
	}

	toString() {
		return this._id
	}
}

export class AssignmentNotFoundError extends Error {
	constructor(key: string) {
		super(`Assignment not found: ${key}`)
	}
}

const labels: Label[] = []
export class Label {
	#_name: string
	#_prerequisites: Label[]
	get name() {
		return this.#_name
	}
	get isUnlocked() {
		const prerequisite = flatAssignments.find((assignment) => this.#_prerequisites.includes(assignment.label) && !assignment.passed)
		return !prerequisite
	}
	static getByName(name: string) {
		return labels.find((label) => label.name === name)
	}
	static getSortNumber(name: string) {
		return labels.findIndex((label) => label.name === name)
	}
	constructor(name: string, prerequisites: Label[]) {
		this.#_name = name
		this.#_prerequisites = prerequisites
		labels.push(this)
	}
}
export const Introduction = new Label('Introduction', [])
export const JS_Fundamentals = new Label('Fundamentals', [Introduction])

const [assignments, setAssignments] = createStore<Record<Language, Record<string, Assignment[]>>>({
	'JavaScript / TypeScript': {},
})
const flatAssignments: Assignment[] = []
export abstract class Assignment {
	#_key: UniqueID
	#_title: string
	#_label: Label
	#_language: Language
	#_segments: {
		get: Accessor<string>
		set: (value: string) => void
	}[]
	#_answer: number | string | boolean | null | object
	#_hashKey: string = ''
	#_passed: boolean = false
	get hashKey(): string {
		if (!this.#_hashKey) {
			throw new Error('Hash key not set')
		}
		return this.#_hashKey
	}
	set hashKey(hashKey: string) {
		if (this.#_hashKey) {
			throw new Error('Hash key already set')
		}
		this.#_hashKey = hashKey
		this.#_passed = localStorage.getItem(`${LOCAL_STORAGE_PREFIX_PASSED_ASSIGNMENT}${this.#_hashKey}`) !== null
	}
	get key() {
		return this.#_key
	}
	get title() {
		return this.#_title
	}
	get label() {
		return this.#_label
	}
	get language() {
		return this.#_language
	}
	get segments() {
		return this.#_segments
	}
	get passed() {
		return this.#_passed
	}
	validate() {
		const engine = new Engine262()
		const ticks: number[] = []
		const failedSegments: string[] = []
		let result: unknown
		let passed: boolean
		let error: Error | undefined
		this.#_segments.forEach((segment) => {
			let script = failedSegments.join('\n')
			if (script) {
				script += '\n'
			}
			const scriptSegment = segment.get()
			script += scriptSegment
			const res = engine.evaluate(script)
			ticks.push(res.ticks)
			result = res.result
			error = res.error
			if (error) {
				failedSegments.push(scriptSegment)
			} else {
				failedSegments.splice(0, failedSegments.length)
			}
		})
		if (result === undefined) {
			passed = false
		} else if (![typeof this.#_answer, typeof result].find((type) => type !== 'object')) {
			passed = JSON.stringify(this.#_answer) === JSON.stringify(result)
		} else {
			passed = this.#_answer === result
		}
		if (passed) {
			this.#_passed = true
		}
		return { result, passed, ticks, error }
	}

	static get assignments() {
		return assignments
	}
	static getAssignment(key: string) {
		const assignment = flatAssignments.find((assignment) => assignment.key.id === key)
		if (!assignment) {
			throw new AssignmentNotFoundError(key)
		}
		return assignment
	}
	static flat() {
		return [...flatAssignments]
	}

	constructor(
		key: string,
		language: Language,
		label: Label,
		title: string,
		assignment: string[],
		answer: number | string | boolean | null | object,
	) {
		if (
			!key.match(
				/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
			)
		) {
			throw new Error('Key is not a valid UUID')
		}
		if (assignment.length < 2) {
			throw new Error('Assignment must have at least 2 strings')
		}
		this.#_key = new UniqueID(key)
		this.#_title = title
		this.#_label = label
		this.#_language = language
		this.#_answer = answer
		this.#_segments = []
		assignment.forEach((segment, index) => {
			const [segmentSignal, setSegmentSignal] = createSignal(segment)
			const s: {
				get: Accessor<string>
				set: (value: string) => void
			} = {
				get: () => segmentSignal(),
				set: (value) => {
					if (index % 2 === 0) {
						throw new Error('Cannot set a read-only segment')
					}
					setSegmentSignal(value)
				},
			}
			this.#_segments.push(s)
		})
		flatAssignments.push(this)
		setAssignments((store) => {
			if (!store[language][label.name]) {
				store[language][label.name] = []
			}
			store[language][label.name].push(this)
			return store
		})
	}
}
