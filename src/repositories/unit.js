export class UnitRepository {
  constructor (connection) {
    this.query = connection.query
  }

  async create ({ type, location, state }) {
    const sql = {
      query: 'INSERT INTO unit VALUES (default, ?, ?, ?); \
        \ SELECT LAST_INSERT_ID();',
      values: [type, location, state]
    }
    await this.query(sql.query, sql.values)
  }

  async get () {
    const sql = {
      query: 'SELECT * FROM unit ORDER BY `type` LIMIT 1000'
    }
    return await this.query(sql.query)
  }

  async getById (id) {
    const sql = {
      query: 'SELECT * FROM unit WHERE id=? LIMIT 1',
      values: [id]
    }
    return (await this.query(sql.query, sql.values))[0]
  }

  async update (id, { type, location, state }) {
    const sql = {
      query: 'UPDATE unit SET type=?, location=?, state=? WHERE id=? \
        \ LIMIT 1',
      values: [type, location, state, id]
    }
    await this.query(sql.query, sql.values)
  }

  async delete (id) {
    const sql = {
      query: 'DELETE FROM unit WHERE id=? LIMIT 1',
      values: [id]
    }
    await this.query(sql.query, sql.values)
  }
}