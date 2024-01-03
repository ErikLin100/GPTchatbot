const express = require('express');
const cors = require('cors');
const { OpenAIAPI } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

const openai = new OpenAIAPI({
  key: process.env.VITE_OPENAI_API_KEY,
  endpoint: 'https://api.openai.com/v1/chat/completions',
});

const systemMessage = {
  role: 'system',
  content: "You are a customer support chatbot, providing answers ONLY to questions...",
};

app.post('/chat', async (req, res) => {
  const apiRequestBody = {
    model: 'gpt-3.5-turbo',
    messages: [systemMessage, ...req.body.messages],
    temperature: 0.3,
  };

  try {
    const completion = await openai.chat.completions.create(apiRequestBody);
    const chatResponse = completion.choices[0].message.content;

    res.json({ chatResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));