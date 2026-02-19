import { PasswordService } from './password.service'

describe('PasswordService', () => {
  const sut = new PasswordService()

  it('Should return true if password is correct', async () => {
    const hashPassword = await sut.hashPassword('MyPassword')
    const result = await sut.isPasswordCorrect(hashPassword, 'MyPassword')

    expect(result).toBeTruthy()
  })

  it('Should return false if password is incorrect', async () => {
    const hashPassword = await sut.hashPassword('MyPassword')
    const result = await sut.isPasswordCorrect(hashPassword, 'NotMyPassword')

    expect(result).toBeFalsy()
  })
})
