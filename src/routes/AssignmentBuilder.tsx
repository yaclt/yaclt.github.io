import { createSignal, createUniqueId, For, type Signal } from 'solid-js'

export default () => {
	const codes: Signal<string>[] = []
	const [segments, setSegments] = createSignal(1)
	const [code, setCode] = createSignal('')

	function updateCode(element: HTMLTextAreaElement) {
		const value = JSON.stringify(element.value)
		const index = parseInt(element.id.split('_').at(-1) ?? '0')
		if (codes[index]) {
			codes[index][1](value)
		} else {
			codes[index] = createSignal(value)
		}

		const codeList: string[] = []
		codes.forEach((code) => {
			codeList.push(code[0]())
		})
		setCode('[\n' + codeList.join(',\n') + '\n]')
	}

	return (
		<div>
			<h1>Assignment Builder</h1>
			{crypto.randomUUID()}

			<input id={createUniqueId()} type='number' min={1} value={segments()} onChange={(e) => setSegments(Number(e.target.value))} />

			<div style='display: flex; flex-direction: column;'>
				<For each={Array.from({ length: segments() })}>
					{(_, index) => (
						<textarea
							id={'segment_' + index().toString()}
							onInput={(e) => updateCode(e.target)}
						/>
					)}
				</For>
			</div>

			<p>Code:</p>
			<textarea value={code()} />
		</div>
	)
}
