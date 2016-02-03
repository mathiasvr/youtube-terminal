var ffmpeg = require('./ffmpeg')
var asciiPixels = require('ascii-pixels')
var charm = require('charm')
var Throttle = require('stream-throttle').Throttle
var RawImageStream = require('./raw-image-stream')

// render video as ascii characters
module.exports = function (video, options) {
  // TODO: maybe it is needed to null-check video.size and m, and default to '256x144'
  var m = video.size.match(/^(\d+)x(\d+)$/)
  var videoSize = { width: m[1], height: m[2]}

  // set the dimensions for the scaled video
  var frameWidth = Math.round(options.width)
  var frameHeight = Math.round(videoSize.height / (videoSize.width / frameWidth))
  var frameSize = frameWidth * frameHeight * 3 // rgb24

  var term

  ffmpeg.rawImageStream(video.url, options)
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

      // convert to ascii art, but slice of the last newline
      var ascii = asciiPixels(imageData, options).slice(0, -1)

      term.erase('screen').position(0, 0).write(ascii)
    })
    .on('end', function () {
      term.cursor(true).end()
    })
}
