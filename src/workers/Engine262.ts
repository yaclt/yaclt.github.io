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

function addJsonWrapper(script: string) {
	const lines = script.trim().split('\n')
	const response = lines.pop()
	script = lines.join('\n')
	return script + `\nJSON.stringify(${response})`
}

let tickCounter = 0
let thresholdChecker = 0

function evaluate(script: string, measureTicks = false, threshold = 1_000_000) {
	if (threshold <= 0) {
		throw new Error('Threshold must be greater than 0')
	}

	tickCounter = 0
	thresholdChecker = 0
	const realm = new ManagedRealm({})

	if (!measureTicks) {
		script = addJsonWrapper(script)
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
		} else if (!measureTicks) {
			result = JSON.parse(raw.Value.value as string)
		}
	} catch (err) {
		error = err
	}
	const ticks = tickCounter - ticksAtStart
	return { result, ticks, error }
}

onmessage = (event: MessageEvent) => {
	const { script } = event.data
	const { ticks, error: error1 } = evaluate(script, true)
	if (error1) {
		postMessage({ result: undefined, ticks, error: error1 })
		return
	}
	const { result, error: error2 } = evaluate(script, false)
	postMessage({ result, ticks, error: error1 || error2 })
}

postMessage(null)
