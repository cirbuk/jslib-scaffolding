import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import pkg from './package.json';

export default [
  // browser-friendly UMD build

  {
    // Change input file as required(point to js file if not a typescript library)
    input: 'src/index.ts',

    output: {
      // Change output library name
      name: 'library',
      file: pkg.browser,
      format: 'umd',
    },

    plugins: [
      alias({
        entries: [{find: 'types', replacement: './src/types'}],
      }),
      typescript(),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        plugins: [
          require('@babel/plugin-transform-class-properties'),
          require('@babel/plugin-proposal-function-bind'),
          require('@babel/plugin-transform-object-rest-spread'),
        ],
        extensions: ['.js', '.ts'],
      }),
      commonjs(), // so Rollup can convert external deps to ES6
      terser(),
    ],
  },

  {
    // Change input file as required(point to js file if not a typescript library)
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'es',
      },
    ],
    plugins: [
      alias({
        entries: [{find: 'types', replacement: './src/types'}],
      }),
      // Remove if not a typescript library
      typescript(),
    ],
  },
];
