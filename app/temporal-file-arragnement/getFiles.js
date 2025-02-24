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
async function getFiles(dir, excludeDir, baseDir) {
    if (!baseDir) {
      baseDir = dir;
    }
    let files = [];
    const items = await readdir(dir, { withFileTypes: true });

    for (const item of items) {
        if (isExcluded(item.name)) {
          continue
        }

        const fullPath = path.join(dir, item.name);
        const relativePath = path.relative(baseDir, fullPath);

        if (item.isDirectory()) {
            if (item.name !== excludeDir) {
                const subFiles = await getFiles(fullPath, excludeDir, baseDir);
                files = files.concat(subFiles);
            }
        } else {
            const createdAt = await getFileCreationTime(fullPath);
            files.push({ path: relativePath, createdAt });
        }
    }

    return files;
}

module.exports = getFiles