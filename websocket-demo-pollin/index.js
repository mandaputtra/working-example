const fastify = require('fastify')({ logger: false })
const path = require('path')
const WebsocketServer = require('./socket')

// these plugin only used to serve static files
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
})

// room here are Websocket Object that extends EventEmmiter
// so we got EventEmmiter function too
const room = new WebsocketServer({ server: fastify.server })

room.on('ping', (sender, _message) => {
  room.send(sender, { type: 'pong' })
})

room.on('welcome', (sender, message) => {
  if (message.oldId) {
    room.deleteId(oldId)
  }
})

room.on('vote', (sender, message) => {
  room.presidents[message.vote] += 1
  room.broadcast({ type: 'update', id: sender, vote: room.presidents })
})

// Serve HTML from public dir
fastify.get('/', async (_request, reply) => {
  reply.redirect('index.html')
})

const start = async () => {
  try {
    await fastify.listen(3000)
    console.log(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
