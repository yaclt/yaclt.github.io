import { imports as assignmentImports } from '../src/AssignmentBuilder.tsx'
import { assertEquals } from 'jsr:@std/assert@1.0.18'

Deno.test('AssignmentBuilder', async () => {
	await Promise.allSettled(assignmentImports).then((results) => assertEquals(results.find((result) => result.status === 'rejected'), undefined))
})
