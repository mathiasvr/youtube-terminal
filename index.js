#!/usr/bin/env node

var ytdl = require('ytdl-core')
var Speaker = require('speaker')
var youtubeSearch = require('youtube-crawler')
var debug = require('debug')('yt-term')
var pcmAudio = require('./lib/pcm-audio')
var asciiVideo = require('./lib/ascii-video')

// command line options
var argv = require('minimist')(process.argv.slice(2), {
  alias: { l: 'link', i: 'invert', c: 'contrast', w: 'width' },
  boolean: 'invert'
})

if (argv.link) {
  // play from youtube link
  console.log('Playing:', argv.link)
  play(argv.link)
} else if (argv._.length > 0) {
  // search youtube and play the first result
  var query = argv._.join(' ')
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

    // audio only, sorted by quality
    var audioItems = info.formats
      .filter(function (format) { return format.resolution === null })
      .sort(function (a, b) { return b.audioBitrate - a.audioBitrate })

    // low resolution video only, webm prefered
    var videoItems = info.formats
      .filter(function (format) { return format.resolution === '144p' && format.audioBitrate === null })
      .sort(function (a, b) { return a.container === 'webm' ? -1 : 1 })

    var audio = audioItems[0] // highest bitrate
    var video = videoItems[0] // lowest resolution

    debug('Video format: %s (%s)', video.resolution, video.encoding)
    debug('Audio quality: %s (%s)', audio.audioBitrate + 'kbps', audio.audioEncoding)

    var speaker = new Speaker()

    var updateSpeaker = function (codec) {
      speaker.channels = codec.audio_details[2] === 'mono' ? 1 : 2
      speaker.sampleRate = parseInt(codec.audio_details[1].match(/\d+/)[0], 10)
    }

    // play audio
    pcmAudio(audio.url).on('codecData', updateSpeaker).pipe(speaker)

    // play ascii video
    asciiVideo(video.url, {
      fps: argv.fps || 12,
      width: argv.width || 80,
      contrast: (argv.contrast || 50) * 2.55,
      invert: argv.invert
    })
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
  console.log('    -c, --contrast [percent] Adjust video contrast [default: 50]')
  console.log('    -w, --width [number]     ASCII video character width [default: 80]')
  console.log('    --fps [number]           Playback framerate [default: 12]')
  console.log()
  process.exit(0)
}
