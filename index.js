var createSwarm = require('hyperdrive-archive-swarm')
var createStream = require('hypercore-create-stream')

module.exports = function swarmStream (key, opts) {
  if (!opts) opts = {}

  var stream = createStream(key, opts)

  var swarm
  if (!opts.static || !stream.write) {
    swarm = createSwarm(stream.feed)
    bind(stream, swarm)

    if (opts.exit) {
      stream.on('end', function () {
        swarm.node.close()
      })
      stream.on('finish', function () {
        swarm.node.close()
      })
    }
  } else {
    stream.on('finish', function () {
      if (!opts.exit) {
        swarm = createSwarm(stream.feed)
        bind(stream, swarm)
      }
    })
  }

  return stream
}

function bind (stream, swarm) {
  swarm.on('error', stream.emit.bind(stream, 'error'))
  swarm.on('connection', stream.emit.bind(stream, 'connection'))
  swarm.on('close', stream.emit.bind(stream, 'exit'))
  stream.swarm = swarm
  stream.exit = swarm.node.close.bind(stream.swarm.node)
}