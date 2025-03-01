const fs = require('fs');
const path = require('path');

/**
 * 遞迴刪除空的子資料夾（排除隱藏檔案）
 * @param {string} directoryPath - 目標資料夾
 * @returns {boolean} 是否已刪除該目錄
 */
function removeEmptyDirectories(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
      return false;
  }

  let isEmpty = true; // 假設該資料夾是空的

  // 讀取目錄內的所有項目
  const items = fs.readdirSync(directoryPath);

  items.forEach(item => {
      const itemPath = path.join(directoryPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
          // 遞迴檢查子資料夾
          const isSubdirEmpty = removeEmptyDirectories(itemPath);
          if (isSubdirEmpty) {
              fs.rmdirSync(itemPath);
              console.log(`已刪除空資料夾: ${itemPath}`);
          } else {
              isEmpty = false;
          }
      } else if (!item.startsWith('.')) {
          // 如果遇到非隱藏檔案，則該目錄不是空的
          isEmpty = false;
      }
  });

  return isEmpty;
}

// 使用範例
// const targetDirectory = '/path/to/your/directory'; // 請修改成你的目標資料夾
// removeEmptySubdirectories(targetDirectory);

module.exports = removeEmptySubdirectories