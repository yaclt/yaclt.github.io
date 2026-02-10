import { createStore } from 'solid-js/store'
import { createSignal } from 'solid-js'
import type { Accessor } from 'solid-js'
import { Engine262 } from './Engine262.tsx'
import { encodeHex } from '@std/encoding'

export const LOCAL_STORAGE_PREFIX_PASSED_ASSIGNMENT = 'passed_assignment_:'
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

const [assignments, setAssignments] = createStore<Assignment[]>([])
export abstract class Assignment {
	#_key: UniqueID
	#_title: string
	#_label: string
	#_language: Language
	#_segments: {
		get: Accessor<string>
		set: (value: string) => void
	}[]
	#_answer: number | string | boolean | null | object
	#_hashKey: string = ''
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
	validate() {
		const engine = new Engine262()
		const ticks: number[] = []
		let result: unknown
		let passed: boolean
		let error: Error | undefined
		this.#_segments.forEach((segment, index) => {
			if (error) return
			const res = engine.evaluate((index === 0 ? '' : '\n') + segment.get())
			ticks.push(res.ticks)
			result = res.result
			error = res.error
		})
		if (result === undefined) {
			passed = false
		} else if (![typeof this.#_answer, typeof result].find((type) => type !== 'object')) {
			passed = JSON.stringify(this.#_answer) === JSON.stringify(result)
		} else {
			passed = this.#_answer === result
		}
		return { result, passed, ticks, error }
	}

	static get assignments() {
		return assignments
	}
	static getAssignment(key: string) {
		const assignment = assignments.find((assignment) => assignment.key.id === key)
		if (!assignment) {
			throw new AssignmentNotFoundError(key)
		}
		return assignment
	}

	constructor(
		key: string,
		title: string,
		label: string,
		language: Language,
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
		setAssignments((store) => [...store, this])
	}
}
