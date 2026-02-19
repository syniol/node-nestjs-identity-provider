/**
 * HashPassword will be saved in the database against user's record
 */
export type HashPassword = {
  hash: string
  salt: string
  iterations: number
  keyLength: number
  digest: string
}
