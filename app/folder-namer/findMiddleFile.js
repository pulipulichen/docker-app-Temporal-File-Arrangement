const isReadableFileType = require('./isReadableFileType')

const getThumbnailFile = require('./getThumbnailFile')

/**
 * 找出建立時間最中間的檔案
 * @param {*} files 
 * @returns 
 */
async function findMiddleFile(files, directoryPath) {

  if (files.length === 0) {
      console.log("No files found.");
      return null;
  }

  if (files.length === 1) {
    return files[0].path
  }

  // 依建立時間排序
  files.sort((a, b) => a.createdAt - b.createdAt);

  // 取得中位數索引
  const middleIndex = Math.floor(files.length / 2);

  // 取得中間檔案
  const middleFile = files[middleIndex];

  const thumbnailFile = await getThumbnailFile(path.join(directoryPath, middleFile.path))

  if (!thumbnailFile || isReadableFileType(thumbnailFile) === false) {
    // 若中間檔案是不可讀取的，則找尋下一個檔案
    const splicedFiles = files.splice(middleIndex, 1)

    return findMiddleFile(splicedFiles);
  }

  // return middleFile ? middleFile.path : null;
  return thumbnailFile
}

module.exports = findMiddleFile