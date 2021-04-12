import { reactive, watchEffect } from 'vue'
import { compileFile } from './sfcCompiler'

export const APP_FILE = 'App.vue'
export const MAIN_FILE = 'main.js'

export const WELCOME_CODE = `
<template>
  <h1>{{ msg }}</h1>
</template>

<script setup>
const msg = 'Hello World!'
</script>
`.trim()

export const MAIN_CODE = `
import { createApp as _createApp } from "vue"

if (window.__app__) {
  window.__app__.unmount()
  document.getElementById('app').innerHTML = ''
}

document.getElementById('__sfc-styles').innerHTML = window.__css__
const app = window.__app__ = _createApp(__modules__["${APP_FILE}"].default)
app.config.errorHandler = e => console.error(e)
app.mount('#app')`
.trim()

export class File {
  filename: string
  code: string
  compiled = {
    js: '',
    css: '',
    ssr: ''
  }

  constructor(filename: string, code = '') {
    this.filename = filename
    this.code = code
  }
}

export interface Store {
  files: Record<string, File>
  activeFilename: string
  readonly activeFile: File
  readonly importMap: string | undefined
  errors: (string | Error)[]
}

let files: Store['files'] = {}

// const savedFiles = location.hash.slice(1)
const savedFiles = undefined
if (savedFiles) {
  const saved = JSON.parse(atob(savedFiles))
  for (const filename in saved) {
    files[filename] = new File(filename, saved[filename])
  }
} else {
  files = {
    [APP_FILE]: new File(APP_FILE, WELCOME_CODE),
    [MAIN_FILE]: new File(MAIN_FILE, MAIN_CODE)
  }
}

export const store: Store = reactive({
  files,
  activeFilename: APP_FILE,
  get activeFile() {
    return store.files[store.activeFilename]
  },
  get importMap() {
    const file = store.files['import-map.json']
    return file && file.code
  },
  errors: []
})

console.log(store.files)

watchEffect(() => compileFile(store.activeFile))

for (const file in store.files) {
  if (file !== APP_FILE) {
    compileFile(store.files[file])
  }
}

// watchEffect(() => {
//   history.replaceState({}, '', '#' + btoa(JSON.stringify(exportFiles())))
// })

export function exportFiles() {
  const exported: Record<string, string> = {}
  for (const filename in store.files) {
    exported[filename] = store.files[filename].code
  }
  return exported
}

export function setActive(filename: string) {
  store.activeFilename = filename
}

export function addFile(filename: string) {
  const file = (store.files[filename] = new File(filename))

  if (filename === 'import-map.json') {
    file.code = `
{
  "imports": {
  }
}`.trim()
  }

  setActive(filename)
}

export function deleteFile(filename: string) {
  if (confirm(`Are you sure you want to delete ${filename}?`)) {
    if (store.activeFilename === filename) {
      store.activeFilename = APP_FILE
    }
    delete store.files[filename]
  }
}
