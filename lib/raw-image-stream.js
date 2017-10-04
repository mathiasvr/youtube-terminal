var inherits = require('util').inherits
var Transform = require('stream').Transform

module.exports = RawImageStream

function RawImageStream (frameSize) {
  Transform.call(this)
  this.frameSize = frameSize
  this.buffer = Buffer.alloc(0)
}

inherits(RawImageStream, Transform)

RawImageStream.prototype._transform = function (chunk, encoding, callback) {
  var size = this.buffer.length + chunk.length

  if (size < this.frameSize) {
    this.buffer = Buffer.concat([this.buffer, chunk], size)
  } else {
    // buffer = Buffer.concat([buffer, data.slice(0, rest)])
    this.buffer = Buffer.concat([this.buffer, chunk], this.frameSize)

    this.push(this.buffer)

    // rest of chunk
    this.buffer = chunk.slice(chunk.length - (size - this.frameSize))
  }

  callback()
}
