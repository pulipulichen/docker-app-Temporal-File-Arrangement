const fs = require('fs');
const path = require('path');

// const targetDir = '/tmp/test';
// const excludeDir = 'ok'; // Folder to exclude

async function cleanFolder (targetDir, excludeDir) {
  return new Promise(function (resolve, reject) {
    fs.readdir(targetDir, (err, files) => {
      if (err) {
          reject(`Error reading directory: ${err}`);
          return;
      }

      files.forEach(file => {
          const filePath = path.join(targetDir, file);

          fs.stat(filePath, (err, stats) => {
              if (err) {
                  reject(`Error stating file ${filePath}: ${err}`);
                  return;
              }

              if (stats.isDirectory() && file !== excludeDir) {
                  fs.rmdir(filePath, { recursive: true, force: true }, (err) => {
                      if (err) {
                        reject(`Error removing ${filePath}: ${err}`);
                      } else {
                          console.log(`Removed folder: ${filePath}`);
                      }
                  });
              }
          });
      });

      resolve(true)
  });
  })
    
}

module.exports = cleanFolder