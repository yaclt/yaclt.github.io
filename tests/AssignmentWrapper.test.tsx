import { assignmentsReady } from '../src/AssignmentWrapper.tsx'
import { assertEquals } from 'jsr:@std/assert@1.0.18'

Deno.test('AssignmentWrapper', () => {
	assertEquals(assignmentsReady, true)
})
