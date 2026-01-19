// api/chat.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持 POST 请求' });
  }

  const { role, prompt } = req.body;

  // 2. 检查参数是否完整
  if (!role || !prompt) {
    return res.status(400).json({ error: '缺少必要参数 role 或 prompt' });
  }

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_KEY}` // 重要：上线后在 Vercel 后台配置这个 Key
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: role },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    const data = await response.json();

    // 3. 将 DeepSeek 的结果直接透传回前端
    return res.status(200).json(data);
  } catch (error) {
    console.error("后端中转错误:", error);
    return res.status(500).json({ error: '服务器内部错误，请检查 API Key 配置' });
  }
}