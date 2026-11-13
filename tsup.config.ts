import { defineConfig } from 'tsup';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    audio: 'src/audio.ts',
    controls: 'src/controls.ts',
    dialogue: 'src/dialogue.ts',
    arcade: 'src/arcade.ts',
    engine: 'src/engine.ts',
    types: 'src/types.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: false,
  treeshake: true,
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.cjs',
    };
  },
  external: [
    'react',
    'react-dom',
    'phaser',
    'next',
  ],
  async onSuccess() {
    const srcCss = path.resolve(__dirname, 'src/app/globals.css');
    const distCss = path.resolve(__dirname, 'dist/styles.css');
    fs.mkdirSync(path.dirname(distCss), { recursive: true });
    fs.copyFileSync(srcCss, distCss);
    console.log('✓ Synchronized dist/styles.css');
  },
});
