var swarmStream = require('../')
var publisher = swarmStream()
publisher.write('hello')
publisher.on('data', function (block) {
  console.log(block.toString())
})