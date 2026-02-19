import { Knex } from 'knex'
import { PasswordService } from '../../../crypto/password.service'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del()

  const passwordService = new PasswordService()
  await knex('users').insert([
    {
      username: 'guest',
      credential: await passwordService.hashPassword('Guest123456'),
      scopes: ['portal.read'],
    },
  ])
}
