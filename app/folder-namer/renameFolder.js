const isNamedFolder = require('./isNamedFolder')
const getFiles = require('./getFiles')
const findMiddleFile = require('./findMiddleFile')
const extractFileLocation = require('./extractFileLocation')

const getFolderContext = require('./getFolderContext')
const askDify = require('./askDify')

const path = require('path')

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

    let middleFile = await findMiddleFile(files)
    if (middleFile) {
      middleFile = path.join(directoryPath, middleFile)
    }
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
      fs.renameSync(directoryPath, directoryPath + ' ' + askResult)
    }

    // =================================================================
  } catch (err) {
      console.error("Error:", err);
  }
}

module.exports = renameFolder