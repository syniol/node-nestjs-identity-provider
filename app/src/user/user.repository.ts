import { Injectable } from '@nestjs/common'
import { UserEntity } from './user.entity'
import { DatabaseService } from '../infrastructure/db/db.service'
import { HashPassword } from '../crypto/dto/password.dto'

@Injectable()
export class UserRepository {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async findByUsername(
    username: string,
  ): Promise<UserEntity | undefined> {
    return this.databaseService.client
      .queryBuilder()<UserEntity>(UserEntity.Table)
      .select('*')
      .where('username', username)
      .first()
  }

  public async persist(user: Partial<UserEntity>): Promise<UserEntity> {
    return this.databaseService.client
      .queryBuilder()
      .transaction(async (trx) => {
        const [newUserRecord] = await trx<UserEntity>(UserEntity.Table)
          .insert(JSON.parse(JSON.stringify(user)))
          .returning<UserEntity[]>('*')
        if (!newUserRecord) {
          throw new Error('no record been created')
        }

        await trx(`events.${UserEntity.Table}`).insert({
          event: 'NEW_USER_REGISTERED',
          request: JSON.stringify(user),
          response: JSON.stringify(newUserRecord),
        })

        return newUserRecord
      })
  }

  public async updatePassword(
    username: string,
    updatedCredential: HashPassword,
  ): Promise<UserEntity> {
    return this.databaseService.client
      .queryBuilder()
      .transaction(async (trx) => {
        const [updatedUser] = await trx<UserEntity>('users')
          .update({
            credential: updatedCredential,
            updated_at: new Date(),
          })
          .where('users.username', username)
          .returning<UserEntity[]>('*')
        if (!updatedUser) {
          throw new Error('no record been updated')
        }

        await trx(`events.${UserEntity.Table}`).insert({
          event: 'USER_PASSWORD_CHANGED',
          request: JSON.stringify({ username, updatedCredential }),
          response: JSON.stringify(updatedUser),
        })

        return updatedUser
      })
  }
}
