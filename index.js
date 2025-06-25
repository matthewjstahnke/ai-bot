const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

app.use(express.text());  // For plain text body from MixItUp

app.post('/chat', async (req, res) => {
  const userMsg = req.body;

  if (!userMsg) {
    return res.status(400).send('No message provided.');
  }

  try {
const aiResponse = await axios.post(
  'https://api.openai.com/v1/chat/completions',
  {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a sassy but helpful Twitch chatbot. Reply like you are in Twitch chat.' },
      { role: 'user', content: userMsg }
    ]
  },
  {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
  }
);


    const reply = aiResponse.data.choices[0].message.content.trim();
    res.send(reply);
  } catch (error) {
    console.error('OpenAI Error:', error.response?.data || error.message);
    res.status(500).send('Error generating reply.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
