import dts from 'bun-plugin-dts'

await Bun.build({
  entrypoints: ['main.ts'],
  outdir: './dist',
  plugins: [dts()],
  target: 'node',
  external: ['ink', 'react']
});
