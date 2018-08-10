#!/usr/bin/env node

const express = require('express')
const app = express()
require('express-ws')(app)
const jsonServer = require('json-server')

const clients = []
clients.send = message => clients.forEach(client => client.send(message))

// Notification mechanism - done by monkey-patching router.render method
const router = jsonServer.router('data.json')
const render = router.render
router.render = function(req, res) {
  if (res.statusCode < 400 && req.method !== 'GET') {
    clients.send(JSON.stringify({ op: req.method, data: res.locals.data }))
  }
  render.apply(res, arguments)
}

app.use('/api', jsonServer.defaults())
app.use('/api', router)
app.get('/', (req, res) => { res.end('Hello!') })

app.ws('/socket', ws => {
  console.log('Client connected.')
  clients.push(ws)

  ws.on('close', () => {
    console.log('Client disconnected.')
    const index = clients.indexOf(ws)
    if (index > -1) clients.splice(index, 1)
  })
})

app.listen(3000, () => { console.log('Listening on port 3000...') })
