/// <reference lib="webworker" />
import { Agent, ManagedRealm, setSurroundingAgent } from '@magic-works/engine262'

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
//
let tickCounter = 0
let thresholdChecker = 0
const realm = new ManagedRealm({})

function evaluate(script: string, threshold = 1_000_000) {
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
		const raw = realm.evaluateScript(script) as Result
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

self.onmessage = (event: MessageEvent) => {
	const { script } = event.data
	const result = evaluate(script)
	self.postMessage(result)
}
