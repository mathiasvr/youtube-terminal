#!/usr/bin/env node

var ytdl = require('ytdl-core')
var Speaker = require('speaker')
var youtubeSearch = require('youtube-crawler')
var pcmAudio = require('./lib/pcm-audio')
var asciiVideo = require('./lib/ascii-video')

var argv = require('minimist')(process.argv.slice(2), {
  alias: { i: 'invert', c: 'contrast', w: 'width', h: 'help' },
  boolean: ['invert', 'help']
})

if (argv._.length < 1 || argv.help) printUsage()

var query = argv._.join(' ')

// search youtube and play the first result
youtubeSearch(query, function (err, results) {
  if (err) return console.error(err)
  console.log('Playing:', results[0].title)
  play(results[0].link)
})

function play (url) {
  ytdl.getInfo(url, function (err, info) {
    if (err) return console.error(err)

    var audioItems = info.formats.filter(function (format) {
      // audio only
      return format.resolution === null
    // format.type && format.type.startsWith('audio')
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

    var bestAudio = audioItems[0]

    console.log('Audio quality: %s (%s)', bestAudio.audioBitrate + 'kbps', bestAudio.audioEncoding)

    var speaker = new Speaker({
      channels: 2,
      bitDepth: 16,
      sampleRate: bestAudio.audioEncoding === 'opus' ? 48000 : 44100
    })

    // play ascii video
    asciiVideo(videoItems[0].url, argv)

    // TODO: avoid crude audio/video initial sync
    // play audio
    setTimeout(function () { pcmAudio(bestAudio.url).pipe(speaker) }, 250)
  })
}

function printUsage () {
  console.log('Youtube Terminal v' + require('./package.json').version)
  console.log()
  console.log('Usage: youtube-terminal [options] "search query"')
  console.log()
  console.log('Options:')
  console.log()
  console.log('    -i, --invert             Invert colors, recommended on dark background')
  console.log('    -c, --contrast [number]  Adjust video contrast [default: 128]')
  console.log('    -w, --width [number]     ASCII video character width [default: 80]')
  console.log('    -fps [number]            Video framerate [default: 16]')
  console.log()
  process.exit(0)
}
