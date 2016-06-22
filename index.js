var createSwarm = require('hyperdrive-archive-swarm')
var createStream = require('hypercore-create-stream')

module.exports = function swarmStream (key, opts) {
  if (!opts) opts = {}

  var stream = createStream(key, opts)

  var writable = !!stream.write

  stream.swarm = createSwarm(stream.feed)
  stream.on('end', function () {
    if (opts.exit && stream.swarm) stream.swarm.node.close()
    stream.emit('exit')
  })

  if (writable) {
    if (opts.static) {
      stream.on('finish', function () {
        if (stream.swarm) stream.swarm.node.close()
        stream.emit('exit')
      })
    } else {
      stream.on('finish', function () {
        if (opts.exit && stream.swarm) stream.swarm.node.close()
        stream.emit('exit')
      })
    }
  }

  return stream
}