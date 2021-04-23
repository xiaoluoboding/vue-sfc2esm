import * as Crypto from 'crypto'

export const generateHashId = (seed: string) => Crypto.createHash('sha256').update(seed).digest('base64').slice(0, 16)
