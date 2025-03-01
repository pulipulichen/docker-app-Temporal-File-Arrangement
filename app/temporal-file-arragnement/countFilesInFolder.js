const fs = require('fs');
const path = require('path');
const util = require('util');
const ExifParser = require('exif-parser');

const stat = util.promisify(fs.stat);
// const mkdir = util.promisify(fs.mkdir);
// const rename = util.promisify(fs.rename);
const readdir = util.promisify(fs.readdir);

const getFileCreationTime = require('./getFileCreationTime')
const isExcluded = require('./isExcluded')

// 取得所有檔案（排除 bundle）
async function countFilesInFolder(dir) {
    const items = await readdir(dir, { withFileTypes: true });
    let count = 0

    for (const item of items) {
        if (isExcluded(item.name)) {
          continue
        }
        count++
    }

    return count;
}

module.exports = countFilesInFolder