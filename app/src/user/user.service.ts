import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'

import { UserRepository } from './user.repository'
import { UserEntity } from './user.entity'
import { PasswordService } from '../crypto/password.service'

@Injectable()
export class UserService {
  #logger = new Logger(UserService.name)

  public constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  public async handleUsernameLookup(username: string): Promise<UserEntity> {
    return this.userRepository.findByUsername(username)
  }

  public async handleUserCredentialVerification(
    userEntity: UserEntity,
    plainPassword: string,
  ): Promise<boolean> {
    try {
      return await this.passwordService.isPasswordCorrect(
        userEntity.credential,
        plainPassword,
      )
    } catch (error) {
      this.#logger.error(
        error,
        `error verifying user credential for: ${userEntity.username}`,
      )

      throw new UnauthorizedException('error verifying user credential')
    }
  }

  public async handleUserCreation(
    username: string,
    password: string,
    scopes: string[],
  ): Promise<void> {
    await this.userRepository.persist(
      new UserEntity(
        username,
        await this.passwordService.hashPassword(password),
        scopes,
      ),
    )
  }

  public async handleUserPasswordChange(
    username: string,
    password: string,
  ): Promise<void> {
    await this.userRepository.updatePassword(
      username,
      await this.passwordService.hashPassword(password),
    )
  }
}
