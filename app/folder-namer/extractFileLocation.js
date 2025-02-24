const extractGPS = require('./extractGPS')
const getLocation = require('./getLocation')

async function extractFileLocation(filePath) {
    try {
        const { latitude, longitude } = extractGPS(filePath);
        console.log({ latitude, longitude })
        if (!latitude) {
            return null
        }


        const result = await getLocation(latitude, longitude)
        return result
    }
    catch (e) {
        return null
    }
}

module.exports = extractFileLocation;