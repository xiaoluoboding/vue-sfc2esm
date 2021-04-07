import { compileModules } from '../src/index'

(async function () {
  const modules = await compileModules()
  console.log(`successfully compiled ${modules.length} modules.`)
  console.log(modules)
})()
