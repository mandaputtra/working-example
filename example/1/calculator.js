const vorpal = require('vorpal')()
const Redis = require('ioredis')
const redis = new Redis()
const pub = new Redis()

//  subscribe to jobs
redis.subscribe('jobs')

vorpal.show()

vorpal
  .command('calc [numbers...]')
  .action((args, callback) => {
    let str = args.numbers.join(' ')
    pub.publish('jobs', str)
    callback()
  })
