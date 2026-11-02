export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const owner = 'nicoleyeung1132'; // 你的 GitHub 使用者名稱
    const repo = 'ChingBank';      // 你的 GitHub 專案名稱
    const filePath = 'points.json';  // 儲存點數的檔案
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return res.status(500).json({ success: false, error: "未設定 GITHUB_TOKEN 環境變數" });
    }

    try {
      const body = req.body || {};
      const action = body.action;
      const amount = parseInt(body.amount, 10) || 0;

      const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'ChingBank-App'
      };

      // 1. 從 GitHub 讀取目前的 points.json 內容與 SHA (GitHub 寫入時需要驗證 SHA)
      const getRes = await fetch(githubApiUrl, { headers });
      if (!getRes.ok) throw new Error('無法從 GitHub 讀取 points.json');
      
      const fileData = await getRes.json();
      const contentString = Buffer.from(fileData.content, 'base64').toString('utf8');
      const jsonData = JSON.parse(contentString);
      
      let currentPoints = Number(jsonData.points) || 2500;
      const fileSha = fileData.sha; // 取得檔案的 SHA 版本碼

      // 2. 依照動作加或扣點數
      if (action === 'add') {
        currentPoints += amount;
      } else if (action === 'deduct') {
        currentPoints -= amount;
      } else {
        currentPoints += amount;
      }

      // 3. 準備要寫回 GitHub 的新內容 (需轉成 Base64)
      const newContentObj = { points: currentPoints };
      const newContentBase64 = Buffer.from(JSON.stringify(newContentObj, null, 2)).toString('base64');

      // 4. 發送 PUT 請求將新點數 commit 到 GitHub
      const putRes = await fetch(githubApiUrl, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          message: `Update points to ${currentPoints} via mobile shortcut`,
          content: newContentBase64,
          sha: fileSha
        })
      });

      if (!putRes.ok) {
        const errText = await putRes.text();
        throw new Error(`GitHub 寫入失敗: ${errText}`);
      }

      console.log("成功透過 GitHub API 更新點數至:", currentPoints);

      // 5. 回傳結果給手機捷徑
      return res.status(200).json({
        success: true,
        message: `成功${action === 'add' ? '增加' : '扣除'} ${amount} 點`,
        currentPoints: currentPoints
      });

    } catch (error) {
      console.error("GitHub API 錯誤:", error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
