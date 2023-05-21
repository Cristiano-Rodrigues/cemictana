export class DefunctRepository {
  constructor (connection) {
    this.query = connection.query
  }

  async create ({
    name, identification, responsible, bornDate, deathDate, deathCause
  }) {
    const sql = {
      query: 'INSERT INTO defunct VALUES (default, ?, ?, ?, ?, ?, ?); \
        \ SELECT LAST_INSERT_ID();',
      values: [name, identification, bornDate, deathDate, deathCause, responsible]
    }
    await this.query(sql.query, sql.values)
  }

  async get () {
    const sql = {
      query: 'SELECT * FROM defunct ORDER BY `name` LIMIT 1000'
    }
    return await this.query(sql.query)
  }

  async getByName (name) {
    const sql = {
      query: 'SELECT * FROM defunct WHERE name=? LIMIT 1',
      values: [name]
    }
    return (await this.query(sql.query, sql.values))[0]
  }

  async searchByName (name) {
    const sql = {
      query: 'SELECT * FROM defunct WHERE name LIKE ? LIMIT 1000',
      values: [`%${name}%`]
    }
    return await this.query(sql.query, sql.values)
  }

  async getById (id) {
    const sql = {
      query: 'SELECT * FROM defunct WHERE id=? LIMIT 1',
      values: [id]
    }
    return (await this.query(sql.query, sql.values))[0]
  }

  async getByUser (user) {
    const sql = {
      query: 'SELECT * FROM defunct WHERE responsible = ?',
      values: [user]
    }
    return await this.query(sql.query, sql.values)
  }

  async getByIdentification (identification) {
    const sql = {
      query: 'SELECT * FROM defunct WHERE identification=? LIMIT 1',
      values: [identification]
    }
    return (await this.query(sql.query, sql.values))[0]
  }

  async update (id, {
    name, identification, responsible, bornDate, deathDate, deathCause
  }) {
    const sql = {
      query: 'UPDATE defunct SET name=?, identification=?, responsible=?, bornDate=?, \
        \ deathDate=?, deathCause=? WHERE id=? LIMIT 1',
      values: [name, identification, responsible, bornDate, deathDate, deathCause, id]
    }
    await this.query(sql.query, sql.values)
  }

  async delete (id) {
    const sql = {
      query: 'DELETE FROM defunct WHERE id=? LIMIT 1',
      values: [id]
    }
    await this.query(sql.query, sql.values)
  }
}