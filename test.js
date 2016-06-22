var tape = require('tape')
var swarmStream = require('./')

var keys = {
  key: '64895994eafc3229bb6a5140f86b3b94c7d77f7ff31f6c3090bd72d29a9fc7d2',
  secretKey: 'a307ca3702289fbb7d65d69392a563853cc5ec8689e3e013ba350bb53c08ceeb64895994eafc3229bb6a5140f86b3b94c7d77f7ff31f6c3090bd72d29a9fc7d2'
}

var block0 = 'hello'

tape('publishes on swarm', function (t) {
  t.plan(1)

  var publisher = swarmStream(keys.secretKey)
  var consumer = swarmStream(keys.key)

  consumer.once('data', function (block) {
    t.equal(block.toString(), block0, 'retrieved data over swarm')
    publisher.exit()
    consumer.exit()
  })

  publisher.write(block0)
})

tape('publishes static feed on swarm', function (t) {
  t.plan(1)

  var publisher = swarmStream(keys.secretKey, { static: true })
  publisher.write(block0)
  publisher.end()

  var consumer = swarmStream(keys.key, { exit: true })
  consumer.once('data', function (block) {
    t.equal(block.toString(), block0, 'retrieved data over swarm')
    publisher.exit()
    consumer.exit()
  })
})