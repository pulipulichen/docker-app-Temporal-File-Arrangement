const https = require('https');

async function getLocation(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'YourApp/1.0 (your@email.com)' } }, (res) => {
            let data = '';
            
            res.on('data', chunk => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    let city = jsonData.address.city || jsonData.address.town || jsonData.address.village || '';
                    let county = jsonData.address.county || '';
                    let landmark = jsonData.display_name;
                    
                    resolve({ city, county, landmark });
                } catch (error) {
                    reject({ error: '解析錯誤', details: error.message });
                }
            });
        }).on('error', (error) => {
            reject({ error: '請求錯誤', details: error.message });
        });
    });
}

module.exports = getLocation