// 在最上方宣告一個全域變數暫存點數（Vercel 雖會重置，但短時間內或單次請求絕對夠穩）
let globalPoints = 2500;

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { action, amount } = req.body;
    const value = parseInt(amount, 10);

    if (isNaN(value)) {
      return res.status(400).json({ error: '請輸入有效的數字' });
    }

    // 根據動作加扣點
    if (action === 'add') {
      globalPoints += value;
    } else if (action === 'deduct') {
      globalPoints -= value;
    } else {
      return res.status(400).json({ error: '無效的操作動作' });
    }

    // 直接回傳最新點數給手機捷徑
    return res.status(200).json({
      success: true,
      message: `成功${action === 'add' ? '增加' : '扣除'} ${value} 點`,
      currentPoints: globalPoints
    });

  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
