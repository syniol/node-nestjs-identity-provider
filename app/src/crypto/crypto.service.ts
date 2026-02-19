import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { CryptoDecryptedValue, CryptoEncryptedValue } from './dto/crypto.dto'

@Injectable()
export class CryptoService {
  public static readonly EllipticCurve = 'prime192v1'
  public static readonly EncryptionAlgorithm = 'aes-256-ctr'
  public static readonly EncryptionDefaultByteSize = 16

  private readonly secretKey: string

  public constructor() {
    if (!process.env?.CRYPTO_SECRET_KEY?.length) {
      throw new Error('Crypto Secret Key is not defined')
    }

    this.secretKey = process.env.CRYPTO_SECRET_KEY
  }

  public async encrypt(plaintext: string): Promise<CryptoEncryptedValue> {
    return this.encryptPlaintextWithSharedSecretKey(plaintext, this.secretKey)
  }

  public decrypt(hash: CryptoEncryptedValue): Promise<CryptoDecryptedValue> {
    const decipher = createDecipheriv(
      CryptoService.EncryptionAlgorithm,
      this.secretKey,
      Buffer.from(hash.iv, 'hex'),
    )

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(hash.content, 'base64')),
      decipher.final(),
    ])

    return Promise.resolve(decrypted.toString())
  }

  private async encryptPlaintextWithSharedSecretKey(
    text: string,
    secretKey: string,
  ): Promise<CryptoEncryptedValue> {
    const iv = randomBytes(CryptoService.EncryptionDefaultByteSize)
    const cipher = createCipheriv(
      CryptoService.EncryptionAlgorithm,
      secretKey,
      iv,
    )
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

    return Promise.resolve({
      iv: iv.toString('hex'),
      content: encrypted.toString('base64'),
    })
  }
}
