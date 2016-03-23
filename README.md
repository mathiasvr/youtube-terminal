# YouTube Terminal [![npm][npm-img]][npm-url] [![license][lic-img]][lic-url]

[npm-img]: https://img.shields.io/npm/v/youtube-terminal.svg
[npm-url]: https://www.npmjs.com/package/youtube-terminal
[lic-img]: http://img.shields.io/:license-MIT-blue.svg
[lic-url]: http://mvr.mit-license.org

Stream YouTube videos as ascii art in the terminal!

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Feedback is very welcome! :-)

## install

```
npm install -g youtube-terminal
```

Be sure to have [FFmpeg](https://www.ffmpeg.org) installed as well.

## usage

YouTube Terminal will play the first found search result:

```
youtube-terminal [options] 'cyanide and happiness'
```

### options
```
-l, --link [url]         Use YouTube link instead of searching
-i, --invert             Invert colors, recommended on dark background
-c, --contrast [percent] Adjust video contrast [default: 50]
-w, --width [number]     ASCII video character width
-m, --mute               Disable audio playback
--fps [number]           Adjust playback frame rate
```

## todos

- [ ] Automatic scaling (terminal width)
- [ ] Improve video playback (consistent frame interval)
- [ ] Video/Audio synchronization

## related

[ascii-pixels](https://github.com/mathiasvr/ascii-pixels)

## license

MIT
