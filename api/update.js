export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { action, amount } = req.body;
    const value = parseInt(amount, 10);
    const npointUrl = 'https://api.npoint.io/feb752e494d7b4d889ea'; // 你的專屬 npoint 網址

    try {
      // 1. 從 npoint.io 抓取目前的點數
      const getRes = await fetch(npointUrl);
      const getData = await getRes.json();
      let currentPoints = getData.points || 2500;

      // 2. 依照動作加或扣點
      if (action === 'add') {
        currentPoints += value;
      } else if (action === 'deduct') {
        currentPoints -= value;
      }

      // 3. 把最新的點數寫回 npoint.io 儲存
      await fetch(npointUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: currentPoints })
      });

      // 4. 回傳給手機捷徑讓它跳出正確的通知
      return res.status(200).json({
        success: true,
        message: `成功${action === 'add' ? '增加' : '扣除'} ${value} 點`,
        currentPoints: currentPoints
      });

    } catch (error) {
      return res.status(500).json({ error: '更新失敗' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
