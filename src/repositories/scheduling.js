export class SchedulingRepository {
  constructor (connection) {
    this.query = connection.query
  }

  async create ({
    type, schedulingDate, defunct, employee, unit
  }) {
    const sql = {
      query: 'INSERT INTO scheduling VALUES (default, ?, ?, ?, ?, ?, ?, ?); \
        \ SELECT LAST_INSERT_ID();',
      values: [type, schedulingDate, defunct, employee, unit, 0, 0]
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

  async getByUser (user) {
    const sql = {
      query: 'SELECT scheduling.* FROM scheduling \
      \ JOIN defunct ON scheduling.defunct = defunct.id \
      \ JOIN responsible ON defunct.responsible = responsible.user \
      \ WHERE responsible.user = ?',
      values: [user]
    }
    return await this.query(sql.query, sql.values)
  }

  async update (id, {
    type, schedulingDate, defunct, employee, unit, state, deleted
  }) {
    const sql = {
      query: 'UPDATE scheduling SET type=?, schedulingDate=?, \
        \ defunct=?, employee=?, unit=?, state=?, deleted=? WHERE id=? LIMIT 1',
      values: [type, schedulingDate, defunct, employee, unit, state, deleted, id]
    }
    await this.query(sql.query, sql.values)
  }

  async delete (id) {
    const sql = {
      query: 'UPDATE scheduling SET deleted=1 WHERE id=? LIMIT 1',
      values: [id]
    }
    await this.query(sql.query, sql.values)
  }
}