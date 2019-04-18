const NodeResque = require('node-resque')
const Redis = require('ioredis')
const redis = new Redis()
const pub = new Redis()
const math = require('mathjs')
// subschannel in redis
redis.subscribe('jobs')

// connect to redis
const connectionDetails = {
  pkg: 'ioredis',
  host: '127.0.0.1',
  password: null,
  port: 6379,
  database: 0
  // namespace: 'resque',
  // looping: true,
  // options: {password: 'abc'},
}

const jobs = {
  'calc': {
    perform: function add(message) {
      return math.eval(message)
    }
  }
}

const worker = new NodeResque.Worker({ connection: connectionDetails, queues: ['number'] }, jobs)
worker.connect().then(() => worker.start() )

worker.on('start', () => { console.log('worker started') })
worker.on('end', () => { console.log('worker ended') })
worker.on('poll', (queue) => { console.log(`worker polling ${queue}`) })
worker.on('ping', (time) => { console.log(`worker check in @ ${time}`) })
worker.on('job', (queue, job) => { console.log(`working job ${queue} ${JSON.stringify(job)}`) })
worker.on('success', (queue, job, result) => { console.log(`job success ${queue} ${JSON.stringify(job)} >> ${result}`) })
worker.on('failure', (queue, job, failure) => { console.log(`job failure ${queue} ${JSON.stringify(job)} >> ${failure}`) })
worker.on('error', (error, queue, job) => { console.log(`error ${queue} ${JSON.stringify(job)}  >> ${error}`) })
worker.on('pause', () => { console.log('worker paused') })

const queue = new NodeResque.Queue({ connection: connectionDetails }, jobs)
queue.on('error', function (error) { console.log(error) })

queue.connect().then(() => {
  redis.on('message', async function (channel, message) {
    await queue.enqueue('number', 'calc', message)
  })
})
