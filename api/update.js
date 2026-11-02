export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { action, amount } = req.body;
    const value = parseInt(amount, 10);
    // 綁定你的專屬 npoint 網址
    const npointUrl = 'https://api.npoint.io/feb752e494d7b4d889ea';

    try {
      // 1. 從 npoint.io 雲端抓取目前的最新點數
      const getRes = await fetch(npointUrl);
      const getData = await getRes.json();
      let currentPoints = Number(getData.points) || 2500;

      // 2. 依照動作進行累加或扣除運算
      if (action === 'add') {
        currentPoints += value;
      } else if (action === 'deduct') {
        currentPoints -= value;
      }

      // 3. 將計算後的最新點數寫回 npoint.io 儲存
      await fetch(npointUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: currentPoints })
      });

      // 4. 回傳結果給手機捷徑，讓通知正常顯示
      return res.status(200).json({
        success: true,
        message: `成功${action === 'add' ? '增加' : '扣除'} ${value} 點`,
        currentPoints: currentPoints
      });

    } catch (error) {
      return res.status(500).json({ error: '伺服器更新資料失敗' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
