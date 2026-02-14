import { createSignal, createUniqueId, For, type Signal } from 'solid-js'

export default () => {
	const codes: Signal<string>[] = []
	const segmentsInputId = createUniqueId()
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
		<div class='builder-page section-card'>
			<h1>Assignment Builder</h1>
			<div class='form-group'>
				<label>Assignment ID</label>
				<input type='text' value={crypto.randomUUID()} readOnly />
			</div>
			<div class='form-group'>
				<label for={segmentsInputId}>Number of segments</label>
				<input id={segmentsInputId} type='number' min={1} value={segments()} onChange={(e) => setSegments(Number(e.target.value))} />
			</div>
			<div class='form-group'>
				<label>Segment content</label>
				<div class='code-cells' style='display: flex; flex-direction: column; gap: 0.75rem;'>
					<For each={Array.from({ length: segments() })}>
						{(_, index) => (
							<textarea
								id={'segment_' + index().toString()}
								class='code-cell'
								onInput={(e) => updateCode(e.target)}
								placeholder={`Segment ${index() + 1}`}
							/>
						)}
					</For>
				</div>
			</div>
			<div class='form-group'>
				<label>Generated code (JSON)</label>
				<textarea value={code()} readOnly />
			</div>
		</div>
	)
}
