// 修改 update.js 內的變數宣告
global.sharedPoints = global.sharedPoints || 2500;

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { action, amount } = req.body;
    const value = parseInt(amount, 10);

    if (isNaN(value)) {
      return res.status(400).json({ error: '請輸入有效的數字' });
    }

    if (action === 'add') {
      global.sharedPoints += value;
    } else if (action === 'deduct') {
      global.sharedPoints -= value;
    } else {
      return res.status(400).json({ error: '無效的操作動作' });
    }

    return res.status(200).json({
      success: true,
      message: `成功${action === 'add' ? '增加' : '扣除'} ${value} 點`,
      currentPoints: global.sharedPoints
    });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
