//@ts-check
import express from 'express'
import router from './routes.mjs'
import morgan from 'morgan'
import { config } from 'dotenv'
config()
import { dbObj } from './sql.mjs'
import env from 'env-var'

const PORT = env.get('PORT').required().asPortNumber()
const app = express()
app.use(morgan('combined'))
app.use(express.json())

function createRoutesAndListen(app) {
  app.use('/', router)
  app.use((err, req, res, next) => {
    console.error(err.errno)
    if (err.errno === 19) {
      return res.status(400).json({
        error: 'the name already exists in database'
      })
    }
    res.status(400).send(err.message)
  })
  app.listen(PORT, () => {
    console.log(`listening at ${process.env.PORT}`)
  })
}

//triggered when database is openend successfully
dbObj.on('open', () => {
  console.log('opened db')
  createRoutesAndListen(app)
})

dbObj.on('error', (err) => {
  throw err
})

//create initial schema if it doesn't exist
dbObj.run(`
  CREATE TABLE IF NOT EXISTS aliases(
    id varchar(20) primary key,
    name varchar(20) unique
  )
`, [], (err) => {
  if (err)
    throw err
  console.log('created/checked table aliases')
})
