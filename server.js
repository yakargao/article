const express = require('express');
const path = require('path');

const app = express();
const PORT = 10085;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`面试复习站已启动 → http://localhost:${PORT}`);
});
