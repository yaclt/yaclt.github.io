import type { Language } from './types.tsx'

type Result = { result: unknown; ticks: number; error: Error | unknown }

function execute(worker: Worker, script: string): Promise<Result> {
	let resolve = (_data: Result) => undefined
	const promise = new Promise((r) => {
		resolve = r as (data: Result) => undefined
	})
	worker.postMessage({ script })
	worker.onmessage = (event) => {
		resolve(event.data)
	}
	return promise as Promise<Result>
}

export default class {
	static async evaluate(language: Language, script: string | string[]) {
		let worker: Worker
		switch (language) {
			case 'JavaScript / TypeScript':
				worker = new Worker(new URL('/workers/Engine262.ts', import.meta.url), { type: 'module' })
				break
			default:
				throw new Error('Unsupported language')
		}

		if (typeof script === 'string') {
			script = [script]
		}

		const ticks: number[] = []
		const failedSegments: string[] = []
		let result: unknown
		let error: Error | unknown
		let working = Promise.resolve()
		script.forEach((segment) => {
			working = working.then(async () => {
				let script = failedSegments.join('\n')
				if (script) {
					script += '\n'
				}
				script += segment
				const res = await execute(worker, script)
				ticks.push(res.ticks)
				result = res.result
				error = res.error
				if (error) {
					failedSegments.push(segment)
				} else {
					failedSegments.splice(0, failedSegments.length)
				}
			})
		})
		await working
		worker.terminate()
		return Promise.resolve({ result, ticks, error })
	}
}
