var ffmpeg = require('./ffmpeg')
var JPEGStream = require('jpeg-stream')
var jpegDecode = require('jpeg-js').decode
var asciiPixels = require('ascii-pixels')
var charm = require('charm')

var term
var prevTime

var elapsedTime = function () {
  var hrtime = process.hrtime(prevTime || process.hrtime())
  prevTime = process.hrtime()
  return hrtime[0] * 1000 + hrtime[1] / 1000000
}

// render video as ascii characters
module.exports = function (url, options) {
  var frameDuration = 1000 / options.fps
  var waitInterval = 0 // TODO: skipping a frame, to make the code look better...

  var jpegStream = new JPEGStream()
    .on('data', function (jpegBuffer) {
      // try to sync rendering with ffmpeg framerate
      jpegStream.pause()

      setTimeout(function () {
        var timeError = elapsedTime() - frameDuration
        waitInterval -= timeError

        jpegStream.resume()
      }, waitInterval)

      // convert jpeg to ascii for display
      var imageData = jpegDecode(jpegBuffer)
      var ascii = asciiPixels(imageData, options)

      term.erase('screen').position(0, 0).write(ascii)
    })
    .on('end', function () {
      term.cursor(true).end()
    })

  ffmpeg.jpegStream(url, options)
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
    .pipe(jpegStream)
}
