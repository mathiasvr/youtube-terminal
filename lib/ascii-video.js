var ffmpeg = require('./ffmpeg')
var asciiPixels = require('ascii-pixels')
var charm = require('charm')
var Throttle = require('stream-throttle').Throttle
var RawImageStream = require('./raw-image-stream')

// render video as ascii characters
module.exports = function (url, options) {
  // TODO: get dimensions directly
  var frameWidth = options.width
  var frameHeight = Math.round(frameWidth * 0.5625)
  var frameSize = frameWidth * frameHeight * 3 // rgb24

  var term

  ffmpeg.rawImageStream(url, options)
    .on('start', function (commandLine) {
      term = charm(process)

      term.removeAllListeners('^C')
      term.on('^C', function () {
        term.cursor(true)
        process.exit()
      })

      term.reset()
      term.cursor(false)
    })
    .pipe(new Throttle({ rate: frameSize * options.fps }))
    .pipe(new RawImageStream(frameSize))
    .on('data', function (frameData) {
      var imageData = {
        data: frameData,
        width: frameWidth,
        height: frameHeight,
        format: 'RGB24'
      }

      var ascii = asciiPixels(imageData, options)
      
      term.erase('screen').position(0, 0).write(ascii)
    })
    .on('end', function () {
      term.cursor(true).end()
    })
}
