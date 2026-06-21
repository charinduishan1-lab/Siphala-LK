const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// 1. Webhook Verify කරන්න
app.get('/webhook', (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verify_token) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});

// 2. Message ආවම Reply කරන්න
app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object) {
    const message = body.entry[0].changes[0].value.messages[0];
    
    if (message) {
      const from = message.from;
      const msg_body = message.text.body.toLowerCase();
      let reply_text = '';

      // Smart Replies මචං 🔥
      if (msg_body.includes('hi') || msg_body.includes('hello')) {
        reply_text = 'ආයුබෝවන්! Siphala.lk එකට සාදරයෙන් පිළිගන්නවා 🙏\n\nMenu එක බලන්න "menu" කියලා Type කරන්න';
      } 
      else if (msg_body.includes('menu')) {
        reply_text = '📋 *Siphala.lk Menu*\n\n1️⃣ Courses - "courses" කියන්න\n2️⃣ Prices - "price" කියන්න\n3️⃣ Contact - "contact" කියන්න';
      }
      else if (msg_body.includes('courses')) {
        reply_text = '🎓 *අපේ Courses*\n\n- Web Development\n- Graphic Design\n- AI & Chatbots\n\nවැඩි විස්තර "price" කියලා අහන්න';
      }
      else if (msg_body.includes('price')) {
        reply_text = '💰 *Course Fees*\n\nWeb Dev: Rs. 15,000\nDesign: Rs. 12,000\nAI Bot: Rs. 20,000\n\nJoin වෙන්න "contact" කියන්න';
      }
      else if (msg_body.includes('contact')) {
        reply_text = '📞 *Contact Us*\n\nPhone: 071 474 9893\nWeb: siphala.lk\n\nCall කරන්න නැත්තම් Message එකක් දාන්න';
      }
      else {
        reply_text = 'සමාවෙන්න, මට තේරුනේ නෑ 😅\n\n"menu" කියලා Type කරලා Options බලන්න';
      }

      // WhatsApp එකට Reply එක යවනවා
      await axios.post(
        `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to: from,
          text: { body: reply_text },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
    }
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
