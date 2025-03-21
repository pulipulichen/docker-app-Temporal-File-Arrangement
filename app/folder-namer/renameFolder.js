const isNamedFolder = require('./isNamedFolder')
const getFiles = require('./../temporal-file-arragnement/getFiles')
const findMiddleFile = require('./findMiddleFile')
const extractFileLocation = require('./extractFileLocation')

const getFolderContext = require('./getFolderContext')
const askDify = require('./askDify')

const path = require('path')
const fs = require('fs')

const countFilesInFolder = require('./countFilesInFolder')

async function renameFolder(directoryPath) {

  console.log(`================================================================`)
  console.log(directoryPath)
  console.log(`================================================================`)
  // return false

  if (isNamedFolder(directoryPath)) {
    return false
  }
  
  // console.log(directoryPath)

  try {
    const files = await getFiles(directoryPath);
    console.log(`Found ${files.length} files`);
    // console.log(files)

    // =================================================================

    let middleFile = await findMiddleFile(files, directoryPath)
    if (!middleFile) {
      console.log("找不到建立時間最中間的檔案。")
      return false
    }
    // if (middleFile) {
    //   middleFile = path.join(directoryPath, middleFile)
    // }
    console.log(`Middle file: ${middleFile}`)

    // =================================================================

    let locationInfo = await extractFileLocation(middleFile)
    // console.log(locationInfo)

    // =================================================================

    let folderContext = getFolderContext(files)
    // console.log(folderContext)

    // =================================================================

    let contextList = []
    if (locationInfo) {
      contextList.push(`地理位置資訊：
${JSON.stringify(locationInfo, null, 2)}`)
    }

    if (folderContext && folderContext.length > 0) {
      contextList.push(`資料夾內的檔案列表：
${folderContext}`)
    }

    let contextString = contextList.join('\n\n')
    console.log({contextString})

    // =================================================================



    let askResult = await askDify(middleFile, contextString)
    console.log(`Ask Dify result: ${askResult}`)
    // await askDify()

    if (askResult && askResult.length > 5) {
      let renamedFolderPath = directoryPath + ' ' + askResult
      let renamedFolderName = path.basename(renamedFolderPath)
      console.log({
        '檢查路徑': path.join(directoryPath, renamedFolderName),
        '檢查路徑存在': fs.existsSync(path.join(directoryPath, renamedFolderName)),
        '原始路徑': directoryPath,
        '原始路徑檔案': (await countFilesInFolder(directoryPath))
      })
      if (fs.existsSync(path.join(directoryPath, renamedFolderName)) && 
          (await countFilesInFolder(directoryPath)) === 1) {
          fs.renameSync(path.join(directoryPath, renamedFolderName), path.join(path.dirname(directoryPath), renamedFolderName))
          fs.rmdirSync(directoryPath)
          console.log('移動目錄：', path.join(path.dirname(directoryPath), renamedFolderName))
      }
      else {
        fs.renameSync(directoryPath, renamedFolderPath)
        console.log('重新命名目錄', renamedFolderPath)
      }
    }

    // =================================================================
  } catch (err) {
      console.error("Error:", err);
  }
}

module.exports = renameFolder