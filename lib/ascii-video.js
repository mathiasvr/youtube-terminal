var ffmpeg = require('fluent-ffmpeg')
var JPEGStream = require('jpeg-stream')
// TODO: would it be better with png? how is ffmpeg/node performance
var jpegDecode = require('jpeg-js').decode
var asciiPixels = require('ascii-pixels')
var charm = require('charm')

var term

var prevTime
var elapsedTime = function () {
  // TODO: optimally prevTime should be set before the first setTimeout call
  var hrtime = process.hrtime(prevTime || process.hrtime())
  prevTime = process.hrtime()
  return hrtime[0] * 1000 + hrtime[1] / 1000000
}

module.exports = function (url, options) {
  var videoOptions = {
    fps: options.fps || 16,
    width: options.width || 80
  }

  var asciiOptions = {
    contrast: options.contrast,
    invert: options.invert
  }

  // jpeg stream

  var frameDuration = 1000 / videoOptions.fps
  var waitInterval = frameDuration

  var jpegStream = new JPEGStream()

  jpegStream.on('data', function (jpegBuffer) {
    // TODO: use actual video timestamps / implement frame dropping,
    // or at least implement more reliable syncing

    // try to sync rendering with ffmpeg framerate
    jpegStream.pause()

    setTimeout(function () {
      var timeError = elapsedTime() - frameDuration
      waitInterval -= timeError

      jpegStream.resume()
    }, waitInterval)

    // convert jpeg to ascii for display
    var imageData = jpegDecode(jpegBuffer)
    var ascii = asciiPixels(imageData, asciiOptions)

    term.erase('screen').position(0, 0).write(ascii)
  }).on('end', function () {
    term.cursor(true).end()
  })

  // ffmpeg configuration

  ffmpeg(url)
    .format('image2')
    .videoFilters([
      { filter: 'fps', options: videoOptions.fps },
      { filter: 'scale', options: videoOptions.width + ':-1' }
    ])
    .outputOptions('-update', '1')
    .on('start', function (commandLine) {
      // console.log('Spawned FFmpeg with command: ' + commandLine)

      term = charm(process)

      term.removeAllListeners('^C')
      term.on('^C', function () {
        term.cursor(true)
        process.exit()
      })

      term.reset()
      term.cursor(false)
    })
    .on('end', function () {
      // console.log('FFmpeg ended')
    })
    .on('error', function (err) {
      console.error('An error happened: ' + err.message)
    })
    .pipe(jpegStream)
}
