# hypercore-swarm-stream

Create a readable and/or writable stream of a hypercore feed on a [hyperdrive-archive-swarm](https://github.com/karissa/hyperdrive-archive-swarm).

```
npm install hypercore-swarm-stream
```

## Usage 

### Create stream from a secret key

```js
var swarmStream = require('hypercore-swarm-stream')
var publisher = swarmStream(keys.secretKey, { exit: true })
var consumer = swarmStream(keys.key, { exit: true })

var block0 = 'hello'
consumer.once('data', function (block) {
  t.equal(block.toString(), block0, 'retrieved data over swarm')
})

publisher.write(block0)
publisher.end()
```

## API

#### `var stream = swarmStream([key], [options])`

Same as [hypercore-create-stream](https://github.com/lukeburns/hypercore-create-stream) with an additional `exit` option, which closes the swarm when the stream ends.

`key` is either a public or private key. If it is a public key, then the stream will be readable only. If it is a private key, then the stream will be both readable and writable. If it is undefined, then a new feed is made and its public and private keys are given by `stream.key` and `stream.secretKey`.

All `options` are optional.

```js
{
  db: leveldb instance,
  key: buffer,
  secretKey: buffer,
  static: boolean,
  storage: object,
  tail: boolean,
  start: integer,
  end: integer,
  exit: boolean
}
```