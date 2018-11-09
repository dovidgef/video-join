# video-join
`video-join` is a command line tool built with Node.js which enables you to join together any number of ACHD(.MTS) files together 
without re-encoding(no quality loss) while keeping the audio in sync.

## Installation Instructions
This tool works on Windows only.
1. Install Node.js https://nodejs.org/en/download/  (it should work with all recent releases)
2. Clone the repo 
```
git clone https://github.com/dovidgef/video-join.git
cd video-join
```
3. Install dependencies `npm install`
4. Add binary to global path `npm link`

## Usage Instructions
1. Open either Windows CMD or Powershell in the directory containing the video files
2. Make sure that the files are named in alphabetical order so that they are joined in correct order
e.g.
```
001.MTS
002.MTS
003.MTS
```
3. Run `video-join`



### Credits
This script has been adapted from the batch script found at [My AVCHD Videos](http://avchdvideos.blogspot.com/p/creating-batch-file.html)

It makes use of the following free programs:
* [tsMuxeR](https://www.videohelp.com/software/tsMuxeR)
* [eac3to](https://www.videohelp.com/software/eac3to)
