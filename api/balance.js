export default function handler(req, res) {
  // 這裡可以先設定一個測試點數 2500，之後可串接你的資料庫或檔案
  res.status(200).json({ points: 2500 });
}
