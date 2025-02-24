const fs = require('fs');
const path = require('path');
const util = require('util');
const ExifParser = require('exif-parser');

const stat = util.promisify(fs.stat);
// const mkdir = util.promisify(fs.mkdir);
// const rename = util.promisify(fs.rename);
const readdir = util.promisify(fs.readdir);

// 取得所有檔案（排除 bundle）
async function getFiles(dir, excludeDir, baseDir) {
    if (!baseDir) {
      baseDir = dir;
    }
    let files = [];
    const items = await readdir(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        const relativePath = path.relative(baseDir, fullPath);

        if (item.isDirectory()) {
            if (item.name !== excludeDir) {
                const subFiles = await getFiles(fullPath, excludeDir, baseDir);
                files = files.concat(subFiles);
            }
        } else {
            const stats = await stat(fullPath);
            files.push({ path: relativePath, createdAt: stats.birthtime });
        }
    }

    return files;
}

module.exports = getFiles