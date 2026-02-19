import { pbkdf2, randomBytes } from 'node:crypto'
import { promisify } from 'node:util'

import { Injectable } from '@nestjs/common'

import { HashPassword } from './dto/password.dto'

const pbkdf2Async = promisify(pbkdf2)

@Injectable()
export class PasswordService {
  #saltLength = 128
  #keyLength = 64
  #iterations = 1e5
  #digest = 'sha512'

  /**
   * Hash a password with a random salt
   * @param {String} password
   * @return {Promise<HashPassword>}
   */
  public async hashPassword(password: string): Promise<HashPassword> {
    const salt = randomBytes(this.#saltLength).toString('base64')

    const hashBuffer = await pbkdf2Async(
      password,
      salt,
      this.#iterations,
      this.#keyLength,
      this.#digest,
    )

    return {
      hash: hashBuffer.toString('hex'),
      salt,
      iterations: this.#iterations,
      keyLength: this.#keyLength,
      digest: this.#digest,
    }
  }

  /**
   * Compares password attempt to a saved salt-hash-password
   * @param {HashPassword} hashPassword - Saved salt-hash-password
   * @param {String} passwordAttempt - Plain text password attempt
   * @return {Promise<Boolean>}
   */
  public async isPasswordCorrect(
    hashPassword: HashPassword,
    passwordAttempt: string,
  ): Promise<boolean> {
    const hashBuffer = await pbkdf2Async(
      passwordAttempt,
      hashPassword.salt,
      hashPassword.iterations,
      hashPassword.keyLength,
      hashPassword.digest,
    )

    return hashPassword.hash == hashBuffer.toString('hex')
  }
}
