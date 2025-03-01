const fs = require('fs');
const path = require('path');
const util = require('util');
const ExifParser = require('exif-parser');

const stat = util.promisify(fs.stat);
// const mkdir = util.promisify(fs.mkdir);
// const rename = util.promisify(fs.rename);
// const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

// 目標 bundle 資料夾名稱
// const BUNDLE_FOLDER = 'bundle';

function extractDateFromFilename(filename) {
  // Define regex patterns for different formats
  const patterns = [
      /^(\d{4})-(\d{2})-(\d{2})_(\d{2})\.(\d{2})\.(\d{2})/, // Format: 2024-08-31_03.37.52.jpg
      /^IMG_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})(\d{3})/, // Format: IMG_20240628_170635445.jpg
      // /^(\d{4})(\d{2})(\d{2})/ // Format: 20240831 aaa.jpg
      /^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/,  // Format: 20240919_152647.jpg
      /^(\d{4})(\d{2})(\d{2})\s/,  // Format: 20240919 測試.jpg
      /^(\d{4})(\d{2})(\d{2})$/,  // Format: 20240919
      /^Screenshot_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/  // Format: Screenshot_20250301_153251_Settings.png
  ];

  for (const pattern of patterns) {
      const match = filename.match(pattern);
      if (match) {
          let year, month, day, hour = "00", minute = "00", second = "00", millisecond = '000';

          if (match.length >= 8) {
            [ , year, month, day, hour, minute, second, millisecond ] = match;
          }
          else if (match.length >= 4) { 
              // Format: 2024-08-31_03.37.52
              [_, year, month, day] = match;
              if (match.length >= 7) { 
                  hour = match[4];
                  minute = match[5];
                  second = match[6];
              }
          } 
          else { 
              // Format: 20240831 aaa
              [_, year, month, day] = match;
          }

          if (year < 1986) {
            continue
          }

          return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
      }
  }

  return null; // Return null if no valid date found
}

// 取得檔案的拍攝時間（若無 EXIF 資訊則使用建立時間）
async function getFileCreationTime(filePath) {
    const buffer = await readFile(filePath);

    const stats = await stat(filePath);
    let createdTime = stats.mtime
    if (stats.birthtime.getFullYear() > 1970 && (!createdTime || createdTime > stats.birthtime))  {
      createdTime = stats.birthtime
    }

    if (stats.ctime.getFullYear() > 1970 && (!createdTime || createdTime > stats.ctime)) {
      createdTime = stats.ctime
    }

    if (stats.atime.getFullYear() > 1970 && (!createdTime || createdTime > stats.atime)) {
      createdTime = stats.atime
    }

    let pathParts = filePath.split('/')
    for (let i = pathParts.length - 1; i >= 0; i--) {
      let name = pathParts[i]

      let fileNameTime = extractDateFromFilename(name)
      if (fileNameTime && fileNameTime < createdTime) {
        let interval = (createdTime.getTime() - fileNameTime.getTime())
        if (interval > 1000 * 60 * 60 * 24 * 60) {
          createdTime = fileNameTime
        }
      }
    }
      

    // console.log(filePath)
    // console.log(stats)

    try {
        const parser = ExifParser.create(buffer);
        const result = parser.parse();

        if (result.tags && result.tags.DateTimeOriginal) {
            let exifTime = new Date(result.tags.DateTimeOriginal * 1000);
            if (exifTime.getFullYear() > 1970 && (!createdTime || createdTime > exifTime)) {
              return exifTime
            }
        }
    } catch (err) {
        // console.warn(`Failed to read EXIF data for ${filePath}: ${err.message}`);
    }

    // const stats = await stat(filePath);
    // console.log(stats)
    // return stats.birthtime;
    return createdTime
}


module.exports = getFileCreationTime