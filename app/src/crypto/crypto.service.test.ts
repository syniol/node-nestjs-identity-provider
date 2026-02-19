import { createECDH } from 'node:crypto'
import { CryptoService } from './crypto.service'

describe('Crypto Service Test', () => {
  const ecdh = createECDH(CryptoService.EllipticCurve)
  const clientKey = ecdh.generateKeys()
  const clientSecret = ecdh.computeSecret(clientKey)

  process.env.CRYPTO_SECRET_KEY = clientSecret.toString('base64')

  afterAll(() => {
    delete process.env.CRYPTO_SECRET_KEY
  })

  it('should encrypt successfully', async () => {
    const systemUnderTest = new CryptoService()

    await expect(systemUnderTest.encrypt('Syniol Limited')).resolves.toEqual(
      expect.objectContaining({
        content: expect.any(String),
        iv: expect.any(String),
      }),
    )
  })

  it('should decrypt the encrypted value successfully', async () => {
    const systemUnderTest = new CryptoService()

    const actual = await systemUnderTest.encrypt('Syniol Limited')
    await expect(systemUnderTest.decrypt(actual)).resolves.toEqual(
      'Syniol Limited',
    )
  })
})
