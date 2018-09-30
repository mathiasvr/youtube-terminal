# YouTube Terminal
[![npm](https://img.shields.io/npm/v/youtube-terminal.svg)](https://npm.im/youtube-terminal)
![downloads](https://img.shields.io/npm/dt/youtube-terminal.svg)
[![dependencies](https://david-dm.org/mathiasvr/youtube-terminal.svg)](https://david-dm.org/mathiasvr/youtube-terminal)
[![license](https://img.shields.io/:license-MIT-blue.svg)](https://mvr.mit-license.org)

Stream YouTube videos as ascii art in the terminal!

## usage

YouTube Terminal will play the first found search result:

```shell 
$ youtube-terminal [options] 'cyanide and happiness'
```

### options
```
-l, --link [url]         Use YouTube link instead of searching
-i, --invert             Invert colors, recommended on white background
-c, --contrast [percent] Adjust video contrast [default: 50]
-w, --width [number]     ASCII video character width
-m, --mute               Disable audio playback
--fps [number]           Adjust playback frame rate
```
> Note that setting the `--invert` flag had the opposite effect in earlier releases, and was changed based on [this poll](https://github.com/mathiasvr/youtube-terminal/tree/v0.5.2#which-background-color-does-your-terminal-have).

## install

```shell
$ npm install -g youtube-terminal
```

Be sure to have [FFmpeg](https://www.ffmpeg.org) installed as well.

Ubuntu/Debian users should have ALSA installed as well:
```shell
$ sudo apt-get install libasound2-dev
```

## related

[ascii-pixels](https://github.com/mathiasvr/ascii-pixels)

## license

MIT
