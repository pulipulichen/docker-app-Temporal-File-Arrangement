const fs = require('fs');
const path = require('path');
const util = require('util');
const ExifParser = require('exif-parser');

const stat = util.promisify(fs.stat);
// const mkdir = util.promisify(fs.mkdir);
const rename = util.promisify(fs.rename);
const readdir = util.promisify(fs.readdir);

const getFileCreationTime = require('./getFileCreationTime')
const isExcluded = require('./isExcluded')
const ensureDir = require('./ensureDir')

// 取得所有檔案（排除 bundle）
async function getFilesAndMove(dir, excludeDir, baseDir) {
    if (!baseDir) {
      baseDir = dir;
    }
    let baseTargetFolder = path.join(baseDir, excludeDir);
    // let files = [];
    const items = await readdir(dir, { withFileTypes: true });

    for (const item of items) {
        
        try {
            if (isExcluded(item.name)) {
                continue
              }
      
              const fullPath = path.join(dir, item.name);
              const relativePath = path.relative(baseDir, fullPath);
      
              if (item.isDirectory()) {
                  if (item.name !== excludeDir) {
                      await getFilesAndMove(fullPath, excludeDir, baseDir);
                      // const subFiles = await getFiles(fullPath, excludeDir, baseDir);
                      // files = files.concat(subFiles);
                  }
              } else {
                  const createdAt = await getFileCreationTime(fullPath);
                  // files.push({ path: relativePath, createdAt });
      
                  const YYYY = createdAt.getFullYear();
                  const MM = String(createdAt.getMonth() + 1).padStart(2, '0');
                  const DD = String(createdAt.getDate()).padStart(2, '0');
                  
                  const baseFolder = path.join(baseTargetFolder, YYYY.toString(), MM, `${YYYY}${MM}${DD}`);
      
                  const sourcePath = fullPath
                  const targetPath = path.join(baseFolder, relativePath);
                  
                  await ensureDir(path.dirname(targetPath));
                  await rename(sourcePath, targetPath);

                  console.log('移動檔案', sourcePath, targetPath)
              }
        }
        catch (e) {
            console.log(dir, item.name)
            console.error(`Error: ${e.message}`);
            continue
        }
        
    }

    // return files;
}

module.exports = getFilesAndMove