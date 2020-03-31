const EventEmmiter = require('events')
const WebSocket = require('ws')
const { v4: uuid } = require('uuid')

class WebSocketServer extends EventEmmiter {
  constructor({ server }) {
    super()
    // we store our president vote here,
    // its luber-jurdil we only save votes :)
    this.presidents = {
      jokawi: 0,
      kobami: 0
    }
    // pass in your framework server object, so WebSocket will
    // be using the port of your running server.
    this.wss = new WebSocket.Server({ server })
    // create emty object to store the socket, our user database
    this.sockets = Object.create(null)

    // ws is an websocket websockets
    this.wss.on('connection', (ws, req) => {
      
      let id = uuid() // generate random id
      this.sockets[id] = ws // add user to the object

      ws.on('message', message => {
        // ws only accept strings that JSON, 
        // but you can send file too more on that later
        try {
          let msg = JSON.parse(message)
          // emit here are from event emmiter
          // we extends event emmiter on top remember
          // docs on Node.js events https://nodejs.org/api/events.html
          this.emit(msg.type, id, msg)
        } catch (e) {
          console.warn('invalid message', message)
          console.error(e)
        }
      })

      ws.on('close', () => {
        delete this.sockets[id] // delete user if disconnected
      })

      // send user ID on connection
      this.send(id, { type: "welcome", id: id, vote: this.presidents })
    })
  }

  broadcast(msg) {
    for (const key in this.sockets) {
      this.send(key, msg)
    }
  }

  send(id, msg) {
    if (this.sockets[id]) {
      this.sockets[id].send(JSON.stringify(msg));
    } else {
      console.warn(`no socket with the id ${id}`);
    }
  }

  deleteId(id) {
    delete this.sockets[id]
  }
}

module.exports = WebSocketServer
