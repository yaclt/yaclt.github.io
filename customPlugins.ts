import fs from 'node:fs'
import path from 'node:path'
import type { HmrContext } from 'vite'

function findFiles(dir: string, extension: string) {
	const files: string[] = []
	for (const file of fs.readdirSync(dir)) {
		if (fs.statSync(path.join(dir, file)).isDirectory()) {
			files.push(...findFiles(path.join(dir, file), extension))
		} else if (file.endsWith(extension)) {
			files.push(path.join(dir, file).replace(/\\/g, '/').replace(/^public/g, ''))
		}
	}
	return files
}

const workingDirectory = path.resolve().replace(/\\/g, '/')
const assignmentsMarkerStart = `\\/\\*ASSIGNMENT_PATHS_BEGIN\\*\\/`
const assignmentsMarkerEnd = `\\/\\*ASSIGNMENT_PATHS_END\\*\\/`

export default [() => {
	return {
		name: 'build-script',
		buildStart() {
			const assignmentLoaderPath = 'src/AssignmentLoader.tsx'
			const assignmentsService = fs.readFileSync(assignmentLoaderPath, 'utf8')
			const assignmentsFiles = '\n\t' + findFiles('src/assignments', '.tsx').map((file) => `'./${file.replace('src/', '')}'`).join(',\n\t') + ',\n\t'
			const regex = new RegExp(String.raw`${assignmentsMarkerStart}.*${assignmentsMarkerEnd}`, 'gs')
			fs.writeFileSync(assignmentLoaderPath, assignmentsService.replace(regex, assignmentsMarkerStart.replaceAll('\\', '') + assignmentsFiles + assignmentsMarkerEnd.replaceAll('\\', '')))
		},
	}
}, () => {
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
