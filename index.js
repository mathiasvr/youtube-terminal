#!/usr/bin/env node

var ytdl = require('ytdl-core')
var Speaker = require('speaker')
var youtubeSearch = require('youtube-crawler')
var debug = require('debug')('yt-term')
var pcmAudio = require('./lib/pcm-audio')
var asciiVideo = require('./lib/ascii-video')

// command line options
var argv = require('minimist')(process.argv.slice(2), {
  alias: { l: 'link', i: 'invert', c: 'contrast', w: 'width', m: 'mute', h: 'help' },
  boolean: ['invert', 'mute']
})

if (argv.help || (argv._.length <= 0 && !argv.link)) {
  printUsage()
} else if (argv.link) {
  // play from youtube link
  console.log('Playing:', argv.link)
  play(argv.link)
} else {
  // search youtube and play the first result
  var query = argv._.join(' ')
  youtubeSearch(query, function (err, results) {
    if (err) return console.error(err)
    console.log('Playing:', results[0].title)
    play(results[0].link)
  })
}

function play (url) {
  ytdl.getInfo(url, function (err, info) {
    if (err) return console.error(err)

    if (!argv.mute) playAudio(info)

    playVideo(info)
  })
}

function playVideo (info) {
  // low resolution video only, webm prefered
  var videoItems = info.formats
    .filter(function (format) { return format.resolution === '144p' && format.audioBitrate === null })
    .sort(function (a, b) { return a.container === 'webm' ? -1 : 1 })

  // lowest resolution
  var video = videoItems[0]

  debug('Video format: %s [%s] (%s) %sfps', video.resolution, video.size, video.encoding, video.fps)

  // TODO: maybe it is needed to null-check video.size and m, and default to '256x144'
  var size = video.size.match(/^(\d+)x(\d+)$/)

  var videoInfo = {
    url: video.url,
    width: size[1],
    height: size[2]
  }

  var videoOptions = {
    // TODO: some (old?) videos have fps incorrectly set to 1.
    fps: argv.fps /* || video.fps */ || 12,
    // TODO: width does not work well if video height is larger than terminal window
    width: argv.width || process.stdout.columns || 80,
    contrast: (argv.contrast || 50) * 2.55, // percent to byte
    invert: argv.invert
  }

  // play video as ascii
  asciiVideo(videoInfo, videoOptions)
}

function playAudio (info) {
  // audio only, sorted by quality
  var audioItems = info.formats
    .filter(function (format) { return format.resolution === null })
    .sort(function (a, b) { return b.audioBitrate - a.audioBitrate })

  // highest bitrate
  var audio = audioItems[0]

  debug('Audio quality: %s (%s)', audio.audioBitrate + 'kbps', audio.audioEncoding)

  var speaker = new Speaker()

  var updateSpeaker = function (codec) {
    speaker.channels = codec.audio_details[2] === 'mono' ? 1 : 2
    speaker.sampleRate = parseInt(codec.audio_details[1].match(/\d+/)[0], 10)
  }

  // play audio
  pcmAudio(audio.url).on('codecData', updateSpeaker).pipe(speaker)
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
  console.log('    -w, --width [number]     ASCII video character width')
  console.log('    -m, --mute               Disable audio playback')
  console.log('    --fps [number]           Adjust playback frame rate')
  console.log('    -h, --help               Display this usage information')
  console.log()
  process.exit(0)
}
