const fs = require('fs');
const util = require('util');

const mkdir = util.promisify(fs.mkdir);

// 建立目標資料夾（如果不存在）
async function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        await mkdir(dir, { recursive: true });
    }
}

module.exports = ensureDir