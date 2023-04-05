export class SchedulingRepository {
  constructor (connection) {
    this.query = connection.query
  }

  async create ({
    type, schedulingDate, occurenceDate, responsible, defunct, employee, unit
  }) {
    const sql = {
      query: 'INSERT INTO scheduling VALUES (default, ?, ?, ?, ?, ?, ?, ?); \
        \ SELECT LAST_INSERT_ID();',
      values: [type, schedulingDate, occurenceDate, responsible, defunct, employee, unit]
    }
    await this.query(sql.query, sql.values)
  }

  async get () {
    const sql = {
      query: 'SELECT * FROM scheduling ORDER BY `schedulingDate` LIMIT 1000'
    }
    return await this.query(sql.query)
  }

  async getById (id) {
    const sql = {
      query: 'SELECT * FROM scheduling WHERE id=? LIMIT 1',
      values: [id]
    }
    return (await this.query(sql.query, sql.values))[0]
  }

  async update (id, {
    type, schedulingDate, occurenceDate, responsible, defunct, employee, unit
  }) {
    const sql = {
      query: 'UPDATE scheduling SET type=?, schedulingDate=?, occurenceDate=?, \
        \ responsible=?, defunct=?, employee=?, unit=? WHERE id=? LIMIT 1',
      values: [type, schedulingDate, occurenceDate, responsible, defunct, employee, unit, id]
    }
    await this.query(sql.query, sql.values)
  }

  async delete (id) {
    const sql = {
      query: 'DELETE FROM scheduling WHERE id=? LIMIT 1',
      values: [id]
    }
    await this.query(sql.query, sql.values)
  }
}