export class EmployeeRepository {
  constructor (connection) {
    this.query = connection.query
  }

  async create ({
    name, identification, post, bornDate, address
  }) {
    const sql = {
      query: 'INSERT INTO employee VALUES (default, ?, ?, ?, ?, ?); \
        \ SELECT LAST_INSERT_ID();',
      values: [name, identification, post, bornDate, address]
    }
    await this.query(sql.query, sql.values)
  }

  async get () {
    const sql = {
      query: 'SELECT * FROM employee ORDER BY `name` LIMIT 1000'
    }
    return await this.query(sql.query)
  }

  async getById (id) {
    const sql = {
      query: 'SELECT * FROM employee WHERE id=? LIMIT 1',
      values: [id]
    }
    return (await this.query(sql.query, sql.values))[0]
  }

  async getByIdentification (identification) {
    const sql = {
      query: 'SELECT * FROM employee WHERE identification=? LIMIT 1',
      values: [identification]
    }
    return (await this.query(sql.query, sql.values))[0]
  }

  async update (id, {
    name, identification, post, bornDate, address
  }) {
    const sql = {
      query: 'UPDATE employee SET name=?, identification=?, post=?, \
        \ bornDate=?, address=? WHERE id=? LIMIT 1',
      values: [name, identification, post, bornDate, address, id]
    }
    await this.query(sql.query, sql.values)
  }

  async delete (id) {
    const sql = {
      query: 'DELETE FROM employee WHERE id=? LIMIT 1',
      values: [id]
    }
    await this.query(sql.query, sql.values)
  }
}