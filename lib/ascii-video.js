var ffmpeg = require('./ffmpeg')
var through2 = require('through2')
var TokenBucket = require('limiter').TokenBucket
var asciiPixels = require('ascii-pixels')
var ChopStream = require('chop-stream')
var charm = require('charm')

function ThrottleStream (chunksPerSecond) {
  var bucket = new TokenBucket(chunksPerSecond, chunksPerSecond, 'second', null)

  return through2(function (chunk, _, next) {
    bucket.removeTokens(1, function (err) {
      next(err, chunk)
    })
  })
}

function AsciiStream (frameWidth, frameHeight, options) {
  return through2(function (frameData, _, next) {
    var imageData = {
      data: frameData,
      width: frameWidth,
      height: frameHeight,
      format: 'RGB24'
    }

    // convert to ascii art, but slice of the last newline
    var ascii = asciiPixels(imageData, options).slice(0, -1)

    next(null, ascii)
  })
}

// render video as ascii characters
module.exports = function (video, options) {
  // set the dimensions for the scaled video
  var frameWidth = Math.round(options.width)
  var frameHeight = Math.round(video.height / (video.width / frameWidth))
  var frameSize = frameWidth * frameHeight * 3 // rgb24

  var term

  ffmpeg.rawImageStream(video.url, options)
    .on('start', function (commandLine) {
      term = charm(process)

      term.removeAllListeners('^C')
      term.on('^C', function () {
        term.cursor(true).end()
        process.exit()
      })

      term.reset()
      term.cursor(false)
    })
    .pipe(new ChopStream(frameSize))
    .pipe(new ThrottleStream(options.fps))
    .pipe(new AsciiStream(frameWidth, frameHeight, options))
    .on('data', function (ascii) {
      term.erase('screen').position(0, 0).write(ascii)
    })
    .on('end', function () {
      term.cursor(true).end()
    })
}
