import { computed, reactive, watchEffect } from 'vue'
import { compileFile } from './sfc-compiler'

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

<style scoped>
h1 {
  font-size: 2em;
}
</style>
`.trim()

export const MAIN_CODE = getMainCode(APP_FILE)

const IMPORT_MAP_CODE = `
{
  "imports": {
  }
}`.trim()

/**
 * Record the code & errors when a sfc file has been compiled.
 */
interface FileCompiled {
  js: string,
  css: string,
  ssr: string,
  errors: Array<string | Error>
}

/**
 * Simple Virtual File System
 */
export class File {
  filename: string
  code: string
  compiled = {
    js: '',
    css: '',
    ssr: '',
    errors: ['']
  } as FileCompiled

  constructor(filename: string, code = '') {
    this.filename = filename
    this.code = code
  }
}

/**
 * `vue-sfc2esm` built-in store.
 */
export interface Store {
  files: Record<string, File>
  activeFilename: string
  readonly activeFile: File
  readonly importMap: string | undefined
  errors: Array<string | Error>
}

let files: Store['files'] = {}

const savedFiles = ''
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

// console.log(store.files)

watchEffect(() => compileFile(store.activeFile))

export const activeFilename = computed(() => store.activeFilename)
export const mainCode = computed(() => getMainCode(store.activeFilename))

for (const file in store.files) {
  if (file !== APP_FILE) {
    compileFile(store.files[file])
  }
}

export const encodeFiles = () => btoa(JSON.stringify(exportFiles()))

/**
 * Export the files code.
 *
 * @returns exported
 */
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

/**
 * Record File errors when compiling file.
 *
 * @param errors
 */
export function recordFileErrors (errors: Array<string | Error>) {
  store.activeFile.compiled.errors = errors
}

/**
 * Check whether has a filename in store.
 *
 * @param filename
 */
export function hasFile (filename: string) {
  if (!(filename in store.files)) {
    recordFileErrors([`File "${filename}" is not exists.`])
    return
  }
}

/**
 * Add a file into the store, ready for compilation.
 *
 * @param filename
 * @param code
 */
export function addFile (filename: string, code: string) {
  if (
    !filename.endsWith('.vue') &&
    !filename.endsWith('.js') &&
    filename !== 'import-map.json'
  ) {
    recordFileErrors(['Sandbox only supports *.vue, *.js files or import-map.json.'])
    return
  }

  hasFile(filename)

  const file = (store.files[filename] = new File(filename))

  if (filename === 'import-map.json') {
    file.code = IMPORT_MAP_CODE
  } else {
    file.code = code
  }

  setActive(filename, file.code)
}

/**
 * Change the file code, It will trigger `compileFile` action.
 *
 * @param filename
 * @param code
 */
export function changeFile (filename: string, code: string) {
  hasFile(filename)

  const file = store.files[filename]

  setActive(file.filename, code)
}

/**
 * Delete the file in the store. with or without confirmation.
 *
 * @param filename
 * @param withConfirm
 */
export function deleteFile (filename: string, withConfirm?: boolean) {
  hasFile(filename)

  const doDelete = () => {
    if (store.activeFilename === filename) {
      store.activeFilename = APP_FILE
    }
    delete store.files[filename]
  }

  if (withConfirm && confirm(`Are you sure you want to delete ${filename}?`)) {
    doDelete()
    return
  }

  doDelete()
}
