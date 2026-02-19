import { Entity } from '../infrastructure/db/entity'
import { HashPassword } from '../crypto/dto/password.dto'

export class UserEntity extends Entity {
  public static readonly Table = 'users'

  public constructor(
    public readonly username: string,
    public readonly credential: HashPassword,
    public readonly scopes: string[],
    public readonly role?: 'ADMIN' | 'CLIENT',
  ) {
    super()
  }
}
