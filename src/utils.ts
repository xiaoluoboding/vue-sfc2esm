import * as Crypto from 'crypto'

export const hashId = (filename: string) => {
  const hashDigest = Crypto.createHash('sha256').update(filename).digest('base64') // hash the message
  return hashDigest.slice(0, 16)
}
