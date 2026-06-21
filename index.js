const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Environment Variables
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// 1. Webhook Verify කරන්න GET Request එක
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 2. Message එන POST Request එක
app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (messages && messages[0]) {
      const phone_number_id = value.metadata.phone_number_id;
      const from = messages[0].from;
      const msg_body = messages[0].text?.body;

      console.log(`Message from ${from}: ${msg_body}`);

      // Auto Reply යවනවා
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/v19.0/${phone_number_id}/messages`,
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        },
        data: {
          messaging_product: 'whatsapp',
          to: from,
          text: { body: `හරි මචං! උඹ එවපු Message එක: "${msg_body}" \n\nBot එක Vercel එකෙන් වැඩ ✅` }
        }
      });
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Vercel එකට ඕන
app.get('/', (req, res) => {
  res.send('Siphala.LK WhatsApp Bot is Live on Vercel!');
});

// Vercel එකට Export කරන විදිය
module.exports = app;
