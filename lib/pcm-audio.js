var ffmpeg = require('fluent-ffmpeg')

// TODO: fluent-ffmpeg supports stream, but just use url
module.exports = function (streamOrUrl) {
  return ffmpeg(streamOrUrl)
    .noVideo()
    // .audioCodec('copy')
    // .format('ogg')
    .audioCodec('pcm_s16le')
    .format('s16le')

    .on('start', function (commandLine) {
      // console.log('Spawned Ffmpeg with command: ' + commandLine)
    })
    .on('end', function () {
      // console.log('file has been converted succesfully')
    })
    .on('error', function (err) {
      console.error('An error happened: ' + err.message)
    })
}
