export default async function handler(req, res) {
  try {
    // 讀取你剛剛在 npoint.io 建立的網址
    const response = await fetch('https://api.npoint.io/feb752e494d7b4d889ea');
    const data = await response.json();

    return res.status(200).json({ currentPoints: data.points });
  } catch (error) {
    return res.status(500).json({ error: '讀取失敗' });
  }
}
