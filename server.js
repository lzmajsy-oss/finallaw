import express from 'express';  
import { fileURLToPath } from 'url';  
import { dirname, join } from 'path';  
const __filename = fileURLToPath(import.meta.url);  
const __dirname = dirname(__filename);  
const app = express();  
const PORT = process.env.PORT || 8080;  
app.use(express.json());  
app.use(express.static(join(__dirname, 'dist')));  
app.post('/api/chat', async (req, res) => {  
  const { role, prompt } = req.body;  
  if (!role || !prompt) {  
    return res.status(400).json({ error: '缺少必要参数 role 或 prompt' });  
  }  
  try {  
    const response = await fetch("https://api.deepseek.com/chat/completions", {  
      method: 'POST',  
      headers: {  
        'Content-Type': 'application/json',  
        'Authorization': `Bearer ${process.env.DEEPSEEK_KEY}`  
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
    return res.status(200).json(data);  
  } catch (error) {  
    console.error("后端中转错误:", error);  
    return res.status(500).json({ error: '服务器内部错误，请检查 API Key 配置' });  
  }  
});  
app.get('*', (req, res) => {  
  res.sendFile(join(__dirname, 'dist', 'index.html'));  
});  
app.listen(PORT, () => {  
  console.log(`Server running on port ${PORT}`);  
});  
