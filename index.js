var createSwarm = require('hyperdiscovery')
var createStream = require('hypercore-stream')

module.exports = function (key, opts) {
  if (!opts) opts = {}

  var stream = createStream(key, opts)

  var swarm
  if (!opts.static || !stream.write) {
    swarm = createSwarm(stream.feed, { port: null })
    patch(stream, swarm)

    if (opts.exit) {
      stream.on('end', function () {
        swarm.close()
      })
      stream.on('finish', function () {
        swarm.close()
      })
    }
  } else {
    stream.on('finish', function () {
      if (!opts.exit) {
        swarm = createSwarm(stream.feed, { port: null })
        patch(stream, swarm)
      }
    })
  }

  return stream
}

function patch (stream, swarm) {
  swarm.on('error', stream.emit.bind(stream, 'error'))
  swarm.on('connection', stream.emit.bind(stream, 'connection'))
  swarm.on('close', stream.emit.bind(stream, 'close'))

  stream.swarm = swarm
  stream.close = swarm.close.bind(swarm)
}
