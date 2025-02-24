const fs = require('fs');
const path = require('path');
const util = require('util');
const ExifParser = require('exif-parser');

const stat = util.promisify(fs.stat);
const mkdir = util.promisify(fs.mkdir);
const rename = util.promisify(fs.rename);
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

// 目標 bundle 資料夾名稱
const BUNDLE_FOLDER = 'bundle';

// 取得檔案的拍攝時間（若無 EXIF 資訊則使用建立時間）
async function getFileCreationTime(filePath) {
    const buffer = await readFile(filePath);

    const stats = await stat(filePath);
    let createdTime = stats.mtime
    if (!createdTime || createdTime > stats.birthtime) {
      createdTime = stats.birthtime
    }

    if (!createdTime || createdTime > stats.ctime) {
      createdTime = stats.ctime
    }

    if (!createdTime || createdTime > stats.atime) {
      createdTime = stats.atime
    }
    // console.log(stats)

    try {
        const parser = ExifParser.create(buffer);
        const result = parser.parse();

        if (result.tags && result.tags.DateTimeOriginal) {
            let exifTime = new Date(result.tags.DateTimeOriginal * 1000);
            if (!createdTime || createdTime > exifTime) {
              return exifTime
            }
        }
    } catch (err) {
        console.warn(`Failed to read EXIF data for ${filePath}: ${err.message}`);
    }

    // const stats = await stat(filePath);
    // console.log(stats)
    // return stats.birthtime;
    return createdTime
}


module.exports = getFileCreationTime