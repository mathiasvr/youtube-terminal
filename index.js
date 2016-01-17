#!/usr/bin/env node

var ytdl = require('ytdl-core')
var Speaker = require('speaker')
var youtubeSearch = require('youtube-crawler')
var pcmAudio = require('./lib/pcm-audio')
var asciiVideo = require('./lib/ascii-video')

var argv = require('minimist')(process.argv.slice(2), {
  alias: { l: 'link', i: 'invert', c: 'contrast', w: 'width' },
  boolean: 'invert'
})

var query = argv._.join(' ')

if (argv.link) {
  console.log('Playing:', argv.link)
  play(argv.link)
} else if (argv._.length > 0) {
  // search youtube and play the first result
  youtubeSearch(query, function (err, results) {
    if (err) return console.error(err)
    console.log('Playing:', results[0].title)
    play(results[0].link)
  })
} else {
  printUsage()
}

function play (url) {
  ytdl.getInfo(url, function (err, info) {
    if (err) return console.error(err)

    var audioItems = info.formats.filter(function (format) {
      // audio only
      return format.resolution === null
    }).sort(function (a, b) {
      // sort by audio quality
      return b.audioBitrate - a.audioBitrate
    })

    var videoItems = info.formats.filter(function (format) {
      // lowest resolution video only
      return format.resolution === '144p' && format.audioBitrate === null
    }).sort(function (a, b) {
      // prefer webm
      return a.container === 'webm' ? -1 : 1
    })

    var audio = audioItems[0] // highest bitrate
    var video = videoItems[0] // lowest resolution

    console.log('Video format: %s (%s)', video.resolution, video.encoding)
    console.log('Audio quality: %s (%s)', audio.audioBitrate + 'kbps', audio.audioEncoding)

    var speaker = new Speaker({
      channels: 2,
      bitDepth: 16,
      sampleRate: audio.audioEncoding === 'opus' ? 48000 : 44100
    })

    // play ascii video
    asciiVideo(video.url, argv)

    // TODO: avoid crude audio/video initial sync
    // play audio
    setTimeout(function () { pcmAudio(audio.url).pipe(speaker) }, 250)
  })
}

function printUsage () {
  console.log('Youtube Terminal v' + require('./package.json').version)
  console.log()
  console.log('Usage: youtube-terminal [options] "search query"')
  console.log()
  console.log('Options:')
  console.log()
  console.log('    -l, --link [url]         Use YouTube link instead of searching')
  console.log('    -i, --invert             Invert colors, recommended on dark background')
  console.log('    -c, --contrast [number]  Adjust video contrast [default: 128]')
  console.log('    -w, --width [number]     ASCII video character width [default: 80]')
  console.log('    -fps [number]            Video framerate [default: 16]')
  console.log()
  process.exit(0)
}
