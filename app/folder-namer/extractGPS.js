const fs = require('fs');
const ExifParser = require('exif-parser');

function extractGPS(filePath) {
    const buffer = fs.readFileSync(filePath);
    const parser = ExifParser.create(buffer);
    const result = parser.parse();
    // console.log(result)
    if (result.tags.GPSLatitude && result.tags.GPSLongitude) {
        // const latitude = convertDMSToDD(result.tags.GPSLatitude, result.tags.GPSLatitudeRef);
        // const longitude = convertDMSToDD(result.tags.GPSLongitude, result.tags.GPSLongitudeRef);

        const latitude = result.tags.GPSLatitude
        const longitude = result.tags.GPSLongitude
        return { latitude, longitude };
    }

    return null;
}

// function convertDMSToDD(dms, ref) {
//     const degrees = dms[0];
//     const minutes = dms[1];
//     const seconds = dms[2];
//     let dd = degrees + minutes / 60 + seconds / 3600;
//     if (ref === 'S' || ref === 'W') {
//         dd = -dd;
//     }
//     return dd;
// }

module.exports = extractGPS;