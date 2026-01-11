import { defineConfig } from 'rollup';

import dts from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';

import terser from '@rollup/plugin-terser';

export default defineConfig([
    {
        external: ['bun', './src/__tests__/'],

        input: './src/index.ts',

        output: {
            file: './dist/index.js',
            format: 'esm',
        },
        plugins: [typescript({ exclude: ['**/__tests__/**'] }), terser()],
    },

    {
        input: './src/index.ts',

        output: {
            file: './dist/index.d.ts',

            format: 'esm',
        },
        plugins: [dts()],
    },
]);
