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
    name: 'sfc2esm',
    display: 'Sfc2Esm',
    description: 'Compile Vue SFC File to ES Modules.',
    external: [
      'vue',
      '@vue/compiler-sfc/dist/compiler-sfc.esm-browser',
      '@vue/shared',
      'crypto-js/enc-base64',
      'crypto-js/sha256'
    ],
    globals: {
      'vue': 'Vue',
      '@vue/compiler-sfc/dist/compiler-sfc.esm-browser': 'defaultCompiler',
      '@vue/shared': 'shared',
      'crypto-js/enc-base64': 'cryptoBase64',
      'crypto-js/sha256': 'cryptoSha256'
    }
  }
]

export const activePackages = packages.filter(i => !i.deprecated)
