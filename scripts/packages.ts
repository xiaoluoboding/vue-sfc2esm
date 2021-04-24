export interface PackageManifest {
  name: string
  display: string
  addon?: boolean
  author?: string
  description?: string
  external?: string[]
  globals?: Record<string, string>
  manualImport?: boolean
  deprecated?: boolean
}

export const packages: PackageManifest[] = [
  {
    name: 'vue-sfc2esm',
    display: 'VueSFC2Esm',
    description: 'Compile Vue SFC File to ES Modules.',
    external: [
      'vue',
      '@vue/compiler-sfc',
      '@vue/compiler-sfc/dist/compiler-sfc.esm-browser',
      '@vue/shared',
      'crypto'
    ],
    globals: {
      'vue': 'Vue',
      '@vue/compiler-sfc': 'sfcCompiler',
      '@vue/compiler-sfc/dist/compiler-sfc.esm-browser': 'sfcCompilerEsm',
      '@vue/shared': 'shared',
      'crypto': 'Crypto'
    }
  }
]

export const activePackages = packages.filter(i => !i.deprecated)
