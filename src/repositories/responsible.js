export class ResponsibleRepository {
  constructor (connection) {
    this.query = connection.query
  }

  async create ({
    name, identification, bornDate, address, user
  }) {
    const sql = {
      query: 'INSERT INTO responsible VALUES (default, ?, ?, ?, ?, ?); \
        \ SELECT LAST_INSERT_ID();',
      values: [name, identification, bornDate, address, user]
    }
    await this.query(sql.query, sql.values)
  }

  async get () {
    const sql = {
      query: 'SELECT * FROM responsible ORDER BY `name` LIMIT 1000'
    }
    return await this.query(sql.query)
  }

  async getByName (name) {
    const sql = {
      query: 'SELECT * FROM responsible WHERE name=? LIMIT 1',
      values: [name]
    }
    return (await this.query(sql.query, sql.values))[0]
  }

  async getById (id) {
    const sql = {
      query: 'SELECT * FROM responsible WHERE id=? LIMIT 1',
      values: [id]
    }
    return (await this.query(sql.query, sql.values))[0]
  }

  async getByIdentification (identification) {
    const sql = {
      query: 'SELECT * FROM responsible WHERE identification=? LIMIT 1',
      values: [identification]
    }
    return (await this.query(sql.query, sql.values))[0]
  }

  async update (id, {
    name, identification, bornDate, address
  }) {
    const sql = {
      query: 'UPDATE responsible SET name=?, identification=?, bornDate=?, \
        \ address=? WHERE id=? LIMIT 1',
      values: [name, identification, bornDate, address, id]
    }
    await this.query(sql.query, sql.values)
  }

  async delete (id) {
    const sql = {
      query: 'DELETE FROM responsible WHERE id=? LIMIT 1',
      values: [id]
    }
    await this.query(sql.query, sql.values)
  }
}