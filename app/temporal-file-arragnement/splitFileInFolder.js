const fs = require('fs');
const path = require('path');
const util = require('util');

const rename = util.promisify(fs.rename);

const getFiles = require('./getFiles')
const ensureDir = require('./ensureDir')

const walkEachFolder = require('./walkEachFolder')

const MIN_INTER_HOURS = 4

async function splitFileInFolder(directoryPath) {
  await walkEachFolder(directoryPath, async (folderPath) => {
    let files = await getFiles(folderPath)
    
    if (files.length < 2) {
      return true
    }

    files.sort((a, b) => a.createdAt - b.createdAt);
    console.log(files)


    let lastTime = null;
    let baseFolder = path.basename(folderPath);
    let currentSubFolder = path.basename(folderPath);
    
    for (const file of files) {
        const fileTime = file.createdAt.getTime();
        if (lastTime !== null && fileTime - lastTime > MIN_INTER_HOURS * 60 * 60 * 1000) {
            const HH = String(file.createdAt.getHours()).padStart(2, '0');
            currentSubFolder = `${baseFolder}-${HH}`;
        }

        if (currentSubFolder === baseFolder) {
          lastTime = fileTime;
          continue
        }

        // const targetPath = path.join(currentSubFolder, path.basename(file.path));
        const sourcePath = path.join(folderPath, file.path);
        const targetPath = path.join(path.dirname(folderPath), currentSubFolder, file.path);
        
        let targetDir = path.dirname(targetPath)
        console.log(targetDir)
        
        await ensureDir(targetDir);
        await rename(sourcePath, targetPath);
        // const command = `mv "${sourcePath}" "${targetPath}"`
        // console.log(command);
        // await ShellExec(command);
        console.log(`Moved: ${file.path} -> ${targetPath}`);

        
        // if (!outputFolders.includes(currentSubFolder)) {
        //     outputFolders.push(currentSubFolder)
        // }

        lastTime = fileTime;
    }
  })
}

module.exports = splitFileInFolder