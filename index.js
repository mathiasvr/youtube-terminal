#!/usr/bin/env node

var ytdl = require('ytdl-core')
var Speaker = require('speaker')
var youtubeSearch = require('youtube-crawler')
var pcmAudio = require('./lib/pcm-audio')
var asciiVideo = require('./lib/ascii-video')

if (process.argv.length > 2) {
  var query = process.argv.slice(2).join(' ')

  // search youtube and play the first result
  youtubeSearch(query, function (err, results) {
    if (err) return console.error(err)
    console.log('Playing:', results[0].title)
    play(results[0].link)
  })
} else {
  console.log('Syntax: youtube-terminal "search query"')
}

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
    asciiVideo(videoItems[0].url)

    // TODO: avoid crude audio/video initial sync
    // play audio
    setTimeout(function () { pcmAudio(bestAudio.url).pipe(speaker) }, 250)
  })
}
