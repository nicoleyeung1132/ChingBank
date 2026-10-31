import passData from './pass.js'; // 讀取你共用的點數資料

export default function handler(req, res) {
  // 取得最新點數
  const currentPoints = passData.points || 0;

  // 定義 pass.json 的結構
  const passJson = {
    formatVersion: 1,
    passTypeIdentifier: "pass.com.chingbank.points", // 隨意命名
    serialNumber: "chingbank-001",
    teamIdentifier: "CHINGBANK",
    organizationName: "ChingBank",
    description: "大人專屬魔法小卡",
    logoText: "ChingBank",
    foregroundColor: "rgb(255, 255, 255)",
    backgroundColor: "rgb(30, 60, 114)",
    storeCard: {
      primaryFields: [
        {
          key: "points",
          label: "目前點數",
          value: currentPoints
        }
      ]
    }
  };

  // 如果只是單純測試點數 JSON 或跳轉
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(passJson);
}
