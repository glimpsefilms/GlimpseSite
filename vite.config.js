import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        elladj: resolve(__dirname, 'elladj.html'),
        momo: resolve(__dirname, 'momo.html'),
        jasmine: resolve(__dirname, 'jasmine.html'),
        shu: resolve(__dirname, 'shu.html'),
        sondre: resolve(__dirname, 'sondre.html'),
        annika: resolve(__dirname, 'annika.html'),
        mattshilan: resolve(__dirname, 'mattshilan.html'),
        project8: resolve(__dirname, 'project8.html'),
      }
    }
  }
})
