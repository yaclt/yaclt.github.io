import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import deno from '@deno/vite-plugin'
import customPlugins from './customPlugins.tsx'

export default defineConfig({
	plugins: [
		solid(),
		deno(),
		...customPlugins.map((plugin) => plugin()),
	],
})
