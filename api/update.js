export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const npointUrl = 'https://api.npoint.io/feb752e494d7b4d889ea';

    try {
      const body = req.body || {};
      const action = body.action;
      const amount = parseInt(body.amount, 10) || 0;

      // 1. 從 npoint.io 抓取目前的最新點數
      const getRes = await fetch(npointUrl);
      if (!getRes.ok) throw new Error(`讀取 npoint 失敗: ${getRes.status}`);
      const getData = await getRes.json();
      let currentPoints = Number(getData.points) || 2500;

      // 2. 依照動作進行加或扣
      if (action === 'add') {
        currentPoints += amount;
      } else if (action === 'deduct') {
        currentPoints -= amount;
      } else {
        currentPoints += amount;
      }

      // 3. 將計算後的最新點數寫回 npoint.io
      const putRes = await fetch(npointUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: currentPoints })
      });

      if (!putRes.ok) {
        const errText = await putRes.text();
        throw new Error(`npoint 拒絕寫入 (Status ${putRes.status}): ${errText}`);
      }

      // 4. 回傳正確格式給手機捷徑
      return res.status(200).json({
        success: true,
        message: `成功${action === 'add' ? '增加' : '扣除'} ${amount} 點`,
        currentPoints: currentPoints
      });

    } catch (error) {
      console.error("API 執行詳細錯誤:", error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
