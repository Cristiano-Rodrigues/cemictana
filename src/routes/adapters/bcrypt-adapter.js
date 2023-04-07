import bcrypt from 'bcrypt'

export class Hasher {

  hash (data, saltKey) {
    const hashed = bcrypt.hashSync(data, bcrypt.genSaltSync(saltKey))
    return hashed
  }
  
  compare (data, hash) {
    return bcrypt.compareSync(data, hash)
  }
}