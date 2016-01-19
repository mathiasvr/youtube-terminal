# YouTube Terminal [![npm][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/youtube-terminal.svg
[npm-url]: https://www.npmjs.com/package/youtube-terminal

[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)

Stream YouTube videos as ascii art in the terminal!

## install

```
npm install -g youtube-terminal
```

Be sure to have [FFmpeg](https://www.ffmpeg.org) installed as well.

## usage

```
youtube-terminal [options] 'cyanide and happiness'
```

###options
```
-l, --link [url]         Use YouTube link instead of searching
-i, --invert             Invert colors, recommended on dark background
-c, --contrast [percent] Adjust video contrast [default: 50]
-w, --width [number]     ASCII video character width [default: 80]
-fps [number]            Video framerate [default: 16]
```

## license

MIT
