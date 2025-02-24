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

    try {
        const parser = ExifParser.create(buffer);
        const result = parser.parse();

        if (result.tags && result.tags.DateTimeOriginal) {
            return new Date(result.tags.DateTimeOriginal * 1000);
        }
    } catch (err) {
        console.warn(`Failed to read EXIF data for ${filePath}: ${err.message}`);
    }

    const stats = await stat(filePath);
    console.log(stats)
    return stats.birthtime;
}


module.exports = getFileCreationTime