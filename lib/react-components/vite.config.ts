/// <reference types='vitest' />

import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
	root: __dirname,
	cacheDir: '../../node_modules/.vite/lib/react-components',
	plugins: [
		react(),
		dts({
			entryRoot: 'src',
			tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
		}),
		tailwindcss(),
	],
	// Uncomment this if you are using workers.
	// worker: {
	//  plugins: [ nxViteTsPaths() ],
	// },
	// Configuration for building your library.
	// See: https://vitejs.dev/guide/build.html#library-mode
	build: {
		outDir: './dist',
		emptyOutDir: true,
		reportCompressedSize: true,
		commonjsOptions: {
			transformMixedEsModules: true,
		},
		lib: {
			// Could also be a dictionary or array of multiple entry points.
			entry: 'src/index.ts',
			name: 'react-components',
			fileName: 'index',
			// Change this to the formats you want to support.
			// Don't forget to update your package.json as well.
			formats: ['es' as const],
		},
		rollupOptions: {
			// External packages that should not be bundled into your library.
			external: ['react', 'react-dom', 'react/jsx-runtime'],
		},
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
}));
