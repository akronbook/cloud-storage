const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  define: {
    global: 'AWS'
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
      external: ['AWS'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          AWS: 'AWS',
        },
      },
    },
  }
});