import { Assignment } from '../types.tsx'

export default class extends Assignment {
	constructor() {
		super(crypto.randomUUID(), 'Introduction', 'Introduction', 'JavaScript / TypeScript', [])
	}
}
