// const ShellSpawn = require('./lib/ShellSpawn')
const ShellExec = require('./lib/ShellExec')
const GetExistedArgv = require('./lib/GetExistedArgv')

const path = require('path')
const fs = require('fs')

const BUNDLE_FOLDER = '[bundle]'

// const ensureDir = require('./temporal-file-arragnement/ensureDir')
const getFiles = require('./temporal-file-arragnement/getFiles')

const moveFiles = require('./temporal-file-arragnement/moveFiles')

const renameFolder = require('./folder-namer/renameFolder')
const cleanFolder = require('./folder-namer/cleanFolder')

const getFilesAndMove = require('./temporal-file-arragnement/getFilesAndMove')
const splitFileInFolder = require('./temporal-file-arragnement/splitFileInFolder')

// -------------------------------------------------------------


let main = async function () {
  
  let files = GetExistedArgv()
  for (let i = 0; i < files.length; i++) {
    let directoryPath = files[i]
    const stats = fs.statSync(directoryPath);
    if (stats.isDirectory(directoryPath) === false) {
      // directoryPath = path.dirname(directoryPath)
      continue
    }

    // =================================================================

    try {
        await getFilesAndMove(directoryPath, BUNDLE_FOLDER);
        // console.log(`Found ${files.length} files`);
        // console.log(files)

        await splitFileInFolder(path.join(directoryPath, BUNDLE_FOLDER), BUNDLE_FOLDER);

        // let folders = await moveFiles(path.join(directoryPath, BUNDLE_FOLDER), files);
        // for (let i = 0; i < folders.length; i++) {
        //   await renameFolder(folders[i]);
        // }
        // await cleanFolder(directoryPath, BUNDLE_FOLDER)
        
        // console.log("All files moved successfully.");
    } catch (err) {
        console.error("Error:", err);
    }
    // await ShellExec(`sudo chmod 777 -R /input`)
  }
}

main()