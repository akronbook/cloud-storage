const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  define: {
    global: {},
  },
  external: [
    "AWS"
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'cloud-storage',
      fileName: (format) => `cloud-storage.${format}.js`
    }
  }
});