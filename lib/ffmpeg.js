var ffmpeg = require('fluent-ffmpeg')
var debug = require('debug')('yt-term')

function ffmpegWithEvents (url) {
  return ffmpeg(url)
    .on('start', function (commandLine) {
      debug('Spawned FFmpeg with command: ' + commandLine)
    })
    .on('end', function () {
      debug('FFmpeg instance ended')
    })
    .on('error', function (err) {
      console.error('FFmpeg error: ' + err.message)
    })
}

exports.pcmAudio = function (url) {
  return ffmpegWithEvents(url)
    .noVideo()
    .audioCodec('pcm_s16le')
    .format('s16le')
}

exports.jpegStream = function (url, options) {
  return ffmpegWithEvents(url)
    .format('image2')
    .videoFilters([
      { filter: 'fps', options: options.fps },
      { filter: 'scale', options: options.width + ':-1' }
    ])
    .outputOptions('-update', '1')
}

exports.rawImageStream = function (url, options) {
  return ffmpegWithEvents(url)
    .format('image2')
    .videoFilters([
      { filter: 'fps', options: options.fps },
      { filter: 'scale', options: options.width + ':-1' }
    ])
    .outputOptions('-f', 'rawvideo')
    // .outputOptions('-vcodec', 'rawvideo')
    .outputOptions('-pix_fmt', 'rgb32') // TODO: is the order correct
    .outputOptions('-update', '1')
}
