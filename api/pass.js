let passData = {
  points: 2500,
  cardName: "大人專屬魔法小卡",
  holder: "LU YEN TING",
  expiry: "2027/11/22"
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(passData);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
