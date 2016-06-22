var createSwarm = require('hyperdrive-archive-swarm')
var createStream = require('hypercore-create-stream')

module.exports = function swarmStream (key, opts) {
  if (!opts) opts = {}

  var stream = createStream(key, opts)

  var readable = !!stream.read
  var writable = !!stream.write

  if (readable) {
    stream.swarm = createSwarm(stream.feed)
    stream.on('end', function () {
      if (opts.exit && stream.swarm) stream.swarm.node.close()
      stream.emit('exit')
    })
  }

  if (writable) {
    if (opts.static) {
      stream.on('finish', function () {
        if (!opts.exit) stream.swarm = stream.swarm || createSwarm(stream.feed)
        else if (stream.swarm) stream.swarm.node.close()
        stream.emit('exit')
      })
    } else {
      stream.swarm = stream.swarm || createSwarm(stream.feed)
      stream.on('finish', function () {
        if (opts.exit && stream.swarm) stream.swarm.node.close()
        stream.emit('exit')
      })
    }
  }

  return stream
}