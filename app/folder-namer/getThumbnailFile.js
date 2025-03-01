const ShellExec = require('../lib/ShellExec');
const fs = require('fs');
const path = require('path');

const VIDEO_EXT_LIST = [
  '.mp4',
  '.mov',
  '.avi',
  '.mkv',
  '.wmv',
  '.flv',
  '.webm',
  '.ogv',
  '.m4v',
  '.m4a',
  '.m4b',
  '.m4r',
  '.3gp',
  '.3g2',
  '.3gp2',
  '.3gpp',
  '.3gpp2',
  '.3gpp3',
  '.3gpp4',
  '.3gppa',
  '.3gppb',
  '.3gpv2',
  '.3gr',
  '.3gs',
  '.3g2a',
  '.3g2b',
  '.3g2c',
  '.3g2d',
  '.3g2k',
  '.3g2t',
  '.3g2u',
  '.3g2v',
]

const THUMBNAIL_SECOND = [
  10,
  5,
  2,
  0
]

const THUMBNAIL_DIR = `/tmp/thumbnail`

async function getThumbnailFile (filePath) {
  const ext = path.extname(filePath).toLocaleLowerCase()

  if (VIDEO_EXT_LIST.includes(ext) === false) {
    return filePath
  }

  if (fs.existsSync(THUMBNAIL_DIR)) {
    fs.rmdirSync(THUMBNAIL_DIR, {recursive: true})
  }

  for (let i = 0; i < THUMBNAIL_SECOND.length; i++) {
    let second = THUMBNAIL_SECOND[i]

    if (second < 10) {
      second = '0' + second
    }

    let targetPath = path.join(THUMBNAIL_DIR, filePath.slice(0, filePath.lastIndexOf('.')) + '.jpg') 
    let targetDir = targetPath.slice(0, targetPath.lastIndexOf('/'))
    if (fs.existsSync(targetDir) === false) {
      fs.mkdirSync(targetDir, {recursive: true})
    }

    let command = `ffmpeg -i "${filePath}" -ss ${second} -vframes 1 ${targetPath}`
    console.log(command)

    try {
      await ShellExec(command)
      if (fs.existsSync(targetPath)) {
        return targetPath
      }
    }
    catch (e) {
      console.error("FFmpeg convert failed: " + e.message)
    }
  }

  return null
}

module.exports = getThumbnailFile