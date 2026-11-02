import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'api', 'data.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileData);

    res.status(200).json({ points: data.points ?? 2500 });
  } catch (err) {
    res.status(200).json({ points: 2500 });
  }
}
