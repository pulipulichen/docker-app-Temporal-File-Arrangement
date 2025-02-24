const fs = require('fs');
const path = require('path');
const util = require('util');

const isExcluded = require('./isExcluded')

const readdir = util.promisify(fs.readdir);

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

module.exports = walkEachFolder