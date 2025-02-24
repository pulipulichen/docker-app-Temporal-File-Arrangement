const fs = require('fs');
const path = require('path');
const util = require('util');
const ensureDir = require('./ensureDir')

// const stat = util.promisify(fs.stat);
// const mkdir = util.promisify(fs.mkdir);
const rename = util.promisify(fs.rename);
// const readdir = util.promisify(fs.readdir);

const ShellExec = require('./../lib/ShellExec');

const MIN_INTER_HOURS = 4

// 搬移檔案
async function moveFiles(baseTargetFolder, fileList) {
    const groupedFiles = {};

    for (const file of fileList) {
        const date = file.createdAt;
        const YYYY = date.getFullYear();
        const MM = String(date.getMonth() + 1).padStart(2, '0');
        const DD = String(date.getDate()).padStart(2, '0');
        const HH = String(date.getHours()).padStart(2, '0');

        const baseFolder = path.join(baseTargetFolder, YYYY.toString(), MM, `${YYYY}${MM}${DD}`);

        if (!groupedFiles[baseFolder]) {
            groupedFiles[baseFolder] = [];
        }

        groupedFiles[baseFolder].push({ ...file, HH });
    }

    // console.log(groupedFiles)

    for (const baseFolder in groupedFiles) {
        const files = groupedFiles[baseFolder];

        // 依時間排序
        files.sort((a, b) => a.createdAt - b.createdAt);

        let lastTime = null;
        let currentSubFolder = baseFolder;
        
        for (const file of files) {
            const fileTime = file.createdAt.getTime();

            if (lastTime !== null && fileTime - lastTime > MIN_INTER_HOURS * 60 * 60 * 1000) {
                currentSubFolder = `${baseFolder}-${file.HH}`;
            }

            // const targetPath = path.join(currentSubFolder, path.basename(file.path));
            const targetPath = path.join(currentSubFolder, file.path);
            const sourcePath = path.join(path.dirname(baseTargetFolder), file.path);
            await ensureDir(path.dirname(targetPath));
            await rename(sourcePath, targetPath);
            // const command = `mv "${sourcePath}" "${targetPath}"`
            // console.log(command);
            // await ShellExec(command);
            console.log(`Moved: ${file.path} -> ${targetPath}`);

            lastTime = fileTime;
        }
    }
}

module.exports = moveFiles