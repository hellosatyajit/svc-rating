import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import { copy } from '@web/rollup-plugin-copy';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import summary from 'rollup-plugin-summary';

export default {
  input: 'index.html',
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    nodeResolve(),
    minifyHTML(),
    html({
      input: 'index.html',
    }),
    copy({
      patterns: ['images/**/*'],
    }),
    terser({
      ecma: 2020,
      module: true,
      warnings: true,
    }),
    summary(),
  ],
  preserveEntrySignatures: 'strict',
} 