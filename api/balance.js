// 確保兩個檔案共用同一個全域記憶體
global.sharedPoints = global.sharedPoints || 2500;

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      currentPoints: global.sharedPoints
    });
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
