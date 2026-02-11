import { assignmentsReady } from '../src/AssignmentLoader.tsx'
import { assertEquals } from 'jsr:@std/assert@1.0.18'

Deno.test('AssignmentLoader', () => {
	assertEquals(assignmentsReady, true)
})
