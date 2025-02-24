const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const rename = util.promisify(fs.rename);

const getFiles = require('./getFiles')
const isExcluded = require('./isExcluded')
const ensureDir = require('./ensureDir')

async function walkEachFolder(directoryPath, callback) {
  const yearFolders = await readdir(directoryPath, { withFileTypes: true });

  for (const yearFolder of yearFolders) {
    if (isExcluded(yearFolder.name) || yearFolder.isDirectory() === false) {
      continue
    }

    const yearPath = path.join(directoryPath, yearFolder.name)

    const monthFolders = await readdir(yearPath, { withFileTypes: true });

    for (const monthFolder of monthFolders) {
      if (isExcluded(monthFolder.name) || monthFolder.isDirectory() === false) {
        continue
      }

      const monthPath = path.join(yearPath, monthFolder.name)

      const folders = await readdir(monthPath, { withFileTypes: true });

      for (const folder of folders) {
        if (isExcluded(folder.name) || folder.isDirectory() === false) {
          continue
        }

        const folderPath = path.join(monthPath, folder.name)

        await callback(folderPath)
      }
    }
  }
}

async function splitFileInFolder(directoryPath) {
  await walkEachFolder(directoryPath, async (folderPath) => {
    let files = await getFiles(folderPath)
    console.log(files)
    if (files.length < 2) {
      return true
    }

    files.sort((a, b) => a.createdAt - b.createdAt);


    let lastTime = null;
    let baseFolder = path.basename(folderPath);
    let currentSubFolder = path.basename(folderPath);
    
    for (const file of files) {
        const fileTime = file.createdAt.getTime();

        if (lastTime !== null && fileTime - lastTime > MIN_INTER_HOURS * 60 * 60 * 1000) {
            currentSubFolder = `${baseFolder}-${file.HH}`;
        }

        if (currentSubFolder === baseFolder) {
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