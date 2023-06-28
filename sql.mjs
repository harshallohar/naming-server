//@ts-check
import sqlite3 from 'sqlite3'
import env from 'env-var'
import { config } from 'dotenv'
config()

const DB_FILE_PATH = env.get('DB_FILE_PATH').required().asString()

export const dbObj = new sqlite3.Database(DB_FILE_PATH)

export function upsert(obj, calb) {
  dbObj.run(`
    INSERT INTO aliases (id, name)
    VALUES ($id, $name)
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
  `, {
    $id: obj.id,
    $name: obj.name
  },
    (err) => {
      if (err) {
        return calb(err)
      }
      calb(null)
    }
  )
}

export function getPicForName(name, calb) {
  dbObj.get(`
    SELECT id FROM aliases
    WHERE name = $name
  `, {
    $name: name
  }, (err, row) => {
    if (err)
      return calb(err, null)
    calb(null, row)
  })
}

export function getAllNames(calb) {
  dbObj.all(`SELECT name FROM aliases`, [], (err, rows) => {
    if (err)
      return calb(err, null)
    calb(null, rows)
  })
}

export function deleteId(id, calb) {
  dbObj.run(`
  DELETE from aliases where id = $id 
  `, {
    $id: id
  }, (err) => {
    if (err) {
      return calb(err)
    }
    calb(null)
  })
}
