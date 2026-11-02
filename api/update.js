import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { action, amount } = req.body;
    const value = parseInt(amount, 10);

    if (isNaN(value)) {
      return res.status(400).json({ error: '請輸入有效的數字' });
    }

    try {
      const filePath = path.join(process.cwd(), 'api', 'data.json');
      
      // 讀取現有點數
      let currentPoints = 2500;
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileData);
        currentPoints = data.points ?? 2500;
      }

      // 根據動作加扣點
      if (action === 'add') {
        currentPoints += value;
      } else if (action === 'deduct') {
        currentPoints -= value;
      } else {
        return res.status(400).json({ error: '無效的操作動作' });
      }

      // 將新點數寫回檔案
      fs.writeFileSync(filePath, JSON.stringify({ points: currentPoints }, null, 2));

      // 回傳給手機捷徑
      return res.status(200).json({
        success: true,
        message: `成功${action === 'add' ? '增加' : '扣除'} ${value} 點`,
        currentPoints: currentPoints,
        points: currentPoints
      });

    } catch (err) {
      return res.status(500).json({ error: '伺服器寫入資料失敗' });
    }

  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
