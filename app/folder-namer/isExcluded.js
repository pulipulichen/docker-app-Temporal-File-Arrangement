const excludeDirList = [
  '.recycle',
  '.@__thumb',
  '.@upload_cache',
  '@Recently-Snapshot',
  '@Recycle',
  '.DAV',
  '.directory',
  '.nomedia',
  '.obsidian',
  '.git',
  '.thumbnails'
]

const excludeDirStartsWithList = [
  '.Trash-',
  '.~lock.',
  '.~',
  '.davfs.tmp',
]

const excludeDirEndsWithList = [
  '.kate-swp'
]

const isExcluded = function (folderName) {
  if (excludeDirList.indexOf(folderName) > -1) {
    return true
  }

  for (let i = 0; i < excludeDirStartsWithList.length; i++) {
    if (folderName.startsWith(excludeDirStartsWithList[i])) {
      return true
    }
  }

  for (let i = 0; i < excludeDirEndsWithList.length; i++) {
    if (folderName.endsWith(excludeDirEndsWithList[i])) {
      return true
    }
  }

  return false
}

module.exports = isExcluded