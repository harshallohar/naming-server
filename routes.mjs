import { upsert, getPicForName, getAllNames, deleteId } from './sql.mjs'
import { Router } from 'express'
const router = new Router()

// https:// {name.url}/rename/{id of remote}
router.post('/rename/:id', (req, res, next) => {
  if (!(/^[\w]{3,20}$/.test(req.params.id))) {
    return next(Error('invalid pic ID'))
  }
  if (!(/^[\w]{3,20}$/.test(req.body.name))) {
    return next(Error('invalid pic name'))
  }
  upsert({ id: req.params.id, name: req.body.name }, (err) => {
    if (err)
      return next(err)
    res.send('successfully named pic')
  })
})

router.get('/id', (req, res, next) => {
  if (!(/^[\w]{3,20}$/.test(req.query.name))) {
    return next(Error('invalid pic name'))
  }
  getPicForName(req.query.name, (err, id) => {
    if (err)
      return next(err)
    if (!id) {
      return res.send('no pic is aliased to that name')
    }
    res.send(id)
  })
})

router.get('/all-names', (req, res, next) => {
  getAllNames((err, rows) => {
    if (err) {
      return res.status(500).json({
        error: 'internal server error'
      })
    }
    res.json(rows)
  })
})

router.delete('/id/:id', (req, res, next) => {
  if (!(/^[\w]{3,20}$/.test(req.params.id))) {
    return next(Error('invalid pic id'))
  }
  deleteId(req.params.id, (err) => {
    if (err) {
      console.error(err)
      return res.status(200).json({
        error: 'internal server error'
      })
    }
    res.send(`deleted pic: ${req.params.id}`)
  })
})

export default router
