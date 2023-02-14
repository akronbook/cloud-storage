const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  define: {
    global: "globalThis"
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'cloud-storage',
      fileName: (format) => `cloud-storage.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['aws-sdk'],
      output: {
        globals: {
          "aws-sdk": 'AWS',
        },
      },
    },
  },
});