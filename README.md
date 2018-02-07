# YouTube Terminal
[![npm](https://img.shields.io/npm/v/youtube-terminal.svg)](https://www.npmjs.com/package/youtube-terminal)
![downloads](https://img.shields.io/npm/dt/youtube-terminal.svg)
[![dependencies](https://david-dm.org/mathiasvr/youtube-terminal.svg)](https://david-dm.org/mathiasvr/youtube-terminal)
[![license](https://img.shields.io/:license-MIT-blue.svg)](https://mvr.mit-license.org)

Stream YouTube videos as ascii art in the terminal!

## install

```
npm install -g youtube-terminal
```

Be sure to have [FFmpeg](https://www.ffmpeg.org) installed as well.

Ubuntu/Debian users should have ALSA installed as well:
```
sudo apt-get install libasound2-dev
```

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

### Which background color does your terminal have?
I am considering inverting the video colors for better viewing on a dark background by default, but first I would like to know how your terminal looks?

[![](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BVKCQ5K0XJFVNQXKAK3VMPSY/Dark)](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BVKCQ5K0XJFVNQXKAK3VMPSY/Dark/vote)
[![](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BVKCQ5K0XJFVNQXKAK3VMPSY/Bright)](https://m131jyck4m.execute-api.us-west-2.amazonaws.com/prod/poll/01BVKCQ5K0XJFVNQXKAK3VMPSY/Bright/vote)

If more people uses a dark background, the effect of `--invert` will be swapped in a future release.

## todos

- [ ] Improve video playback (consistent frame interval)
- [ ] Video/Audio synchronization

## related

[ascii-pixels](https://github.com/mathiasvr/ascii-pixels)

## license

MIT
