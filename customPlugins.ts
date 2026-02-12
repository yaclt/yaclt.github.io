import path from 'node:path'
import type { HmrContext } from 'vite'

const workingDirectory = path.resolve().replace(/\\/g, '/')

export default [() => {
	return {
		name: 'public-file-changed',
		handleHotUpdate({ server, file }: HmrContext) {
			file = file.replace(workingDirectory, '')
			if (file.startsWith('/public/')) {
				server.ws.send({ type: 'full-reload' })
			}
		},
	}
}]
