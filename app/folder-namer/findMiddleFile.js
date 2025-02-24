// 找出建立時間最中間的檔案
async function findMiddleFile(files) {

  if (files.length === 0) {
      console.log("No files found.");
      return null;
  }

  // 依建立時間排序
  files.sort((a, b) => a.createdAt - b.createdAt);

  // 取得中位數索引
  const middleIndex = Math.floor(files.length / 2);

  // 取得中間檔案
  const middleFile = files[middleIndex];

  return middleFile ? middleFile.path : null;
}

module.exports = findMiddleFile