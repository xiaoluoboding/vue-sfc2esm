import { computed, reactive, watchEffect } from 'vue'
import { compileFile } from './sfcCompiler'

export const APP_FILE = `App.vue`
export const MAIN_FILE = `main.js`

const getMainCode = appFile => {
  return `import { createApp as _createApp } from "vue"

if (window.__app__) {
  window.__app__.unmount()
  document.getElementById('app').innerHTML = ''
}

document.getElementById('__sfc-styles').innerHTML = window.__css__
const app = window.__app__ = _createApp(__modules__["${appFile}"].default)
app.config.errorHandler = e => console.error(e)
app.mount('#app')
`.trim()
}

export const WELCOME_CODE = `<template>
  <h1>{{ msg }}</h1>
</template>

<script setup>
const msg = 'Hello World!'
</script>
`.trim()

export const MAIN_CODE = getMainCode(APP_FILE)

const IMPORT_MAP_CODE = `
{
  "imports": {
  }
}`.trim()


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

export const store = reactive({
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
}) as Store

console.log(store.files)

watchEffect(() => compileFile(store.activeFile))

export const activeFilename = computed(() => store.activeFilename)
export const mainCode = computed(() => getMainCode(store.activeFilename))

for (const file in store.files) {
  if (file !== APP_FILE) {
    compileFile(store.files[file])
  }
}

export const encodeFiles = () => btoa(JSON.stringify(exportFiles()))

export function exportFiles () {
  const exported: Record<string, string> = {}
  for (const filename in store.files) {
    exported[filename] = store.files[filename].code
  }
  return exported
}

export function setActive (filename: string, code: string) {
  store.activeFilename = filename
  store.activeFile.code = code
}

export function addFile (filename: string, code: string) {
  if (
    !filename.endsWith('.vue') &&
    !filename.endsWith('.js') &&
    filename !== 'import-map.json'
  ) {
    store.errors = [`Sandbox only supports *.vue, *.js files or import-map.json.`]
    return
  }

  if (filename in store.files) {
    store.errors = [`File "${filename}" already exists.`]
    return
  }

  const file = (store.files[filename] = new File(filename))

  if (filename === 'import-map.json') {
    file.code = IMPORT_MAP_CODE
  } else {
    file.code = code
  }

  setActive(filename, file.code)
}

export function changeFile (filename: string, code: string) {
  if (!(filename in store.files)) {
    store.errors = [`File "${filename}" is not exists.`]
    return
  }
  const file = store.files[filename]

  setActive(file.filename, code)
}

export function deleteFile (filename: string) {
  if (confirm(`Are you sure you want to delete ${filename}?`)) {
    if (store.activeFilename === filename) {
      store.activeFilename = APP_FILE
    }
    delete store.files[filename]
  }
}
