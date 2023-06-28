//@ts-check
import cliProgress from 'cli-progress'
import { stringify as csvStringify } from 'csv'
import fs from 'node:fs'

const WRITE_URI = 'http://3.136.155.225/inf/napi/rename'
const READ_URI = 'http://3.136.155.225/inf/napi/id?name=for_testing'

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

function getIdNamePair() {
  return {
    id: '1234123412344'
    , name: "for_testing"
  }
}
const WRITES = 100
const records = []

async function writes(wrClb) {
  bar1.start(WRITES, 0)
  for (let i = 1; i <= WRITES; i++) {
    const reqStartTime = new Date().getTime()
    const res = await fetch(`${READ_URI}`, {
      method: 'GET',
      keepalive: false
    })
    await res.text()
    const diffTime = new Date().getTime() - reqStartTime
    const result = {
      status: res.status,
      time: diffTime,
      sl_no: i
    }
    records.push(result)
    bar1.increment()
    if (i === WRITES) {
      wrClb(records)
    }
  }
  bar1.stop()
}

writes((records) => {
  csvStringify(records, {
    header: true
  }, (err, output) => {
    if (err)
      throw err
    fs.writeFile('read_sqlite3_same_con.csv', output, (err) => {
      if (err)
        throw err
    })
  })
})
