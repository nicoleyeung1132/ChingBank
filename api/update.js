import passData from '../pass.js';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { action, amount } = req.body;
    const value = parseInt(amount, 10);

    if (isNaN(value)) {
      return res.status(400).json({ error: '請輸入有效的數字' });
    }

    // 確保 points 存在且為數字
    if (typeof passData.points !== 'number') {
      passData.points = 0;
    }

    if (action === 'add') {
      passData.points += value;
    } else if (action === 'deduct') {
      passData.points -= value;
    }

    return res.status(200).json({
      success: true,
      message: `成功${action === 'add' ? '增加' : '扣除'} ${value} 點`,
      currentPoints: passData.points,
      points: passData.points // 雙重保險，同時提供 points 與 currentPoints
    });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
