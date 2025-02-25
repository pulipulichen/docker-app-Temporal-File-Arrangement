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

const walkEachFolder = require('./temporal-file-arragnement/walkEachFolder')

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
      console.log(`Start getFilesAndMove`);
        await getFilesAndMove(directoryPath, BUNDLE_FOLDER);
        console.log(`Finish getFilesAndMove`);
        // console.log(files)
        await cleanFolder(directoryPath, BUNDLE_FOLDER)
        console.log(`Finish cleanFolder`);

        await splitFileInFolder(path.join(directoryPath, BUNDLE_FOLDER), BUNDLE_FOLDER);
        console.log(`Finish splitFileInFolder`);

        await walkEachFolder(path.join(directoryPath, BUNDLE_FOLDER), async (folderPath) => {
          await renameFolder(folderPath)
        })
        console.log(`Finish renameFolder`);

        // let folders = await moveFiles(path.join(directoryPath, BUNDLE_FOLDER), files);
        // for (let i = 0; i < folders.length; i++) {
        //   await renameFolder(folders[i]);
        // }
        
        
        // console.log("All files moved successfully.");
    } catch (err) {
        console.error("Error:", err);
    }
    // await ShellExec(`sudo chmod 777 -R /input`)
  }
}

main()