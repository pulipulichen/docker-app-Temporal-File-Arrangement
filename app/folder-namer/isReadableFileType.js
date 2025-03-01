const path = require('path');

const READABLE_FILE_TYPE_LIST = [
  '.json',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.bmp',
  '.svg',
  '.txt',
  '.html',
  '.css',
  '.js',
  '.ts',
  '.tsx',
  '.md',
  '.pdf',
  '.doc',
  '.docx',
  '.ppt',
  '.xlsx',
  '.csv',
  '.webp',
  '.mp4',
  '.mov',
  '.avi',
  '.flv',
  '.wmv',
  '.mkv',
]

const isReadableFileType = function(fileName) {
  const ext = path.extname(fileName).toLocaleLowerCase()
  return READABLE_FILE_TYPE_LIST.includes(ext)
}

module.exports = isReadableFileType