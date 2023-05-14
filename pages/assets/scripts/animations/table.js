const head = table.tHead
const body = table.tBodies[0]

function fillDataTable (table, data) {
  if (!data || data.length == 0) return

  const head = table.tHead
  const body = table.tBodies[0]

  const columns = Object.keys(data[0])

  fillHead(head, columns)
  fillBody(body, data)
}

function fillHead (head, columns) {
  head.innerText = ''
  const row = head.insertRow()

  for (const column of columns) {
    const cell = document.createElement('th')
    cell.innerText = column
    row.append(cell)
  }
}

function fillBody (body, data) {
  body.innerText = ''
  const columns = Object.keys(data[0])

  for (const line of data) {
    const row = body.insertRow()
    for (const column of columns) {
      const cell = row.insertCell()
      cell.innerText = line[ column ]
    }
  }
}