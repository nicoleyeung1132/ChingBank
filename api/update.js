import passData from './pass.js';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { action, amount } = req.body;
    const value = parseInt(amount, 10);

    if (isNaN(value)) {
      return res.status(400).json({ error: '請輸入有效的數字' });
    }

    if (action === 'add') {
      passData.points += value;
    } else if (action === 'deduct') {
      passData.points -= value;
    }

    res.status(200).json({
      success: true,
      message: `成功${action === 'add' ? '增加' : '扣除'} ${value} 點`,
      currentPoints: passData.points
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
