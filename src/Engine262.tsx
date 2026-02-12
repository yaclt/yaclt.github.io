import { Agent, CreateDataProperty, Get, ManagedRealm, setSurroundingAgent, Value } from '@magic-works/engine262'

false || CreateDataProperty || Get || Value

setSurroundingAgent(
	new Agent({
		onNodeEvaluation() {
			tickCounter++
			if (thresholdChecker-- < 0) {
				throw new Error('Threshold exceeded')
			}
		},
	}),
)

let tickCounter = 0
let thresholdChecker = 0
export class Engine262 {
	#_realm: ManagedRealm
	constructor() {
		this.#_realm = new ManagedRealm({})
	}
	evaluate(script: string, threshold = 1_000_000_000) {
		if (threshold <= 0) {
			throw new Error('Threshold must be greater than 0')
		}
		thresholdChecker = threshold
		const ticksAtStart = tickCounter
		let result
		let error
		try {
			type Result =
				| { Type: 'throw'; Value: { ErrorData: { value: Error } } }
				| { Type: 'normal'; Value: { value: unknown } }
			const raw = this.#_realm.evaluateScript(script) as Result
			if (raw.Type === 'throw') {
				error = raw.Value.ErrorData.value
			} else {
				result = raw.Value.value
			}
		} catch (err) {
			error = err
		}
		const ticks = tickCounter - ticksAtStart
		return { result, ticks, error }
	}
}
