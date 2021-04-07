import path from 'path'
import replace from '@rollup/plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts'
import filesize from 'rollup-plugin-filesize'

import pkg from '../package.json'
import { activePackages } from './packages'

interface IOutput {
  format: string;
  name: string;
  isMinify: boolean;
  display?: string;
  globals?: object;
  plugins?: Array<any>;
}

const onwarn = (warning, rollupWarn) => {
  const ignoredWarnings = [
    {
      ignoredCode: 'CIRCULAR_DEPENDENCY',
      ignoredPath: './src'
    }
  ]

  // only show warning when code and path don't match
  // anything in above list of ignored warnings
  if (!ignoredWarnings.some(({ ignoredCode, ignoredPath }) => (
    warning.code === ignoredCode &&
    warning.importer.includes(path.normalize(ignoredPath))))
  ) {
    rollupWarn(warning)
  }
}

const configs = []

const minifyPlugins = [
  terser({
    format: {
      comments: false
    },
    compress: {
      drop_console: true
    }
  })
]

const createOutputs = (arg: IOutput) => {
  const {
    format,
    name,
    isMinify,
    display,
    globals = {},
    plugins = []
  } = arg

  let umdSettings = {}

  if (format === 'umd') {
    umdSettings = {
      globals: {
        'vue': 'Vue',
        ...globals,
      },
      name
    }
  }

  let fileType = isMinify ? format + '.min' : format === 'es' ? 'esm' : format

  const makeBanner = name => {
    return `/*!
 * ${name} v${pkg.version}
 * (c) ${new Date().getFullYear()} xiaoluoboding
 * @license MIT
 */`
  }

  return {
    banner: makeBanner(name),
    file: `lib/index.${fileType}.js`,
    format,
    ...umdSettings,
    plugins
  }
}

for (const { name, display, external = [], globals = {} } of activePackages) {
  // build lib cjs/esm/umd/umd.min js
  const configMap = [
    { format: 'cjs', name, isMinify: false },
    { format: 'es', name, isMinify: false },
    { format: 'umd', name, isMinify: false, display, globals },
    { format: 'umd', name, isMinify: true, display, globals, plugins: minifyPlugins },
  ]

  function createEntry (config) {
    return {
      input: `src/index.ts`,
      onwarn,
      output: [
        createOutputs(config),
      ],
      plugins: [
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              declaration: false,
            },
          },
        }),
        replace({
          preventAssignment: true,
          __DEV__: config.format !== 'umd'
            ? `(process.env.NODE_ENV !== 'production')`
            : config.isMinify ? 'false' : 'true'
        }),
        filesize()
      ],
      external: [
        'vue',
        ...external,
      ]
    }
  }

  configMap.map((c) => configs.push(createEntry(c)))

  // build lib d.ts
  configs.push({
    input: `src/index.ts`,
    output: {
      file: `lib/index.d.ts`,
      format: 'es'
    },
    plugins: [
      dts()
    ]
  })
}

export default configs
