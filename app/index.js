// const ShellSpawn = require('./lib/ShellSpawn')
const ShellExec = require('./lib/ShellExec')
const GetExistedArgv = require('./lib/GetExistedArgv')

const path = require('path')
const fs = require('fs')

const BUNDLE_FOLDER = '[bundle]'

const ensureDir = require('./temporal-file-arragnement/ensureDir')
const getFiles = require('./temporal-file-arragnement/getFiles')
const moveFiles = require('./temporal-file-arragnement/moveFiles')

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
      await ensureDir(BUNDLE_FOLDER);

        const files = await getFiles(__dirname, BUNDLE_FOLDER);
        console.log(`Found ${files.length} files`);

        await moveFiles(files);
        console.log("All files moved successfully.");
    } catch (err) {
        console.error("Error:", err);
    }
  }
}

main()