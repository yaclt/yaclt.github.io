import { createStore } from 'solid-js/store'

export type Language = 'JavaScript / TypeScript'

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

const [assignments, setAssignments] = createStore<Assignment[]>([])
export abstract class Assignment {
	#_key: UniqueID
	#_title: string
	#_label: string
	#_language: Language
	#_assignment: string[]
	#_answer: number | string | boolean | null | object
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
	get assignment() {
		return this.#_assignment.slice()
	}
	validate(answer: unknown) {
		if (answer === undefined) {
			return false
		}
		if (![typeof this.#_answer, typeof answer].find((type) => type !== 'object')) {
			return JSON.stringify(this.#_answer) === JSON.stringify(answer)
		}
		return this.#_answer === answer
	}

	static get assignments() {
		return assignments
	}
	static getAssignment(key: string) {
		const assignment = assignments.find((assignment) => assignment.key.id === key)
		if (!assignment) {
			throw new Error('Assignment not found')
		}
		return assignment
	}

	constructor(
		key: string,
		title: string,
		label: string,
		language: Language,
		assignment: string[],
		answer: unknown,
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
		assignment = assignment.map((segment) => segment.trim())
		this.#_key = new UniqueID(key)
		this.#_title = title
		this.#_label = label
		this.#_language = language
		this.#_assignment = assignment
		this.#_answer = answer
		setAssignments((store) => [...store, this])
	}
}
