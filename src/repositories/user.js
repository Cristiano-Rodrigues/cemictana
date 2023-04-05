export class UserRepository {
  constructor (connection) {
    this.query = connection.query
  }

  async create ({
    name, email, password, permission, state, code
  }) {
    const sql = {
      query: 'INSERT INTO user VALUES (default, ?, ?, ?, ?, ?, ?); \
        \ SELECT LAST_INSERT_ID();',
      values: [name, email, password, permission, state, code]
    }
    await this.query(sql.query, sql.values)
  }

  async get () {
    const sql = {
      query: 'SELECT * FROM user ORDER BY `name` LIMIT 1000'
    }
    return await this.query(sql.query)
  }

  async getById (id) {
    const sql = {
      query: 'SELECT * FROM user WHERE id=? LIMIT 1',
      values: [id]
    }
    return (await this.query(sql.query, sql.values))[0]
  }

  async getByEmail (email) {
    const sql = {
      query: 'SELECT * FROM user WHERE email=? LIMIT 1',
      values: [email]
    }
    return (await this.query(sql.query, sql.values))[0]
  }

  async update (id, {
    name, password, permission, state, code
  }) {
    const sql = {
      query: 'UPDATE user SET name=?, password=?, permission=?, state=?, \
        \ code=? WHERE id=? LIMIT 1',
      values: [name, password, permission, state, code, id]
    }
    await this.query(sql.query, sql.values)
  }

  async delete (id) {
    const sql = {
      query: 'DELETE FROM user WHERE id=? LIMIT 1',
      values: [id]
    }
    await this.query(sql.query, sql.values)
  }
}