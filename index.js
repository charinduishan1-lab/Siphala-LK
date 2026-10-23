// CLEMAZ - Single file WhatsApp Salon Bot - index.js
// Works at root /index.js on Vercel
// Set ENV in Vercel: PHONE_ID, WA_TOKEN, VERIFY_TOKEN

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // 1. VERIFICATION - For Meta webhook setup
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const verifyToken = process.env.VERIFY_TOKEN || 'clemaz123';

    if (mode === 'subscribe' && token === verifyToken) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send('Verification failed');
    }
  }

  // 2. RECEIVE MESSAGE
  if (req.method === 'POST') {
    try {
      const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
      if (!message) return res.status(200).send('ok');

      const from = message.from;
      let userText = message.text?.body?.toLowerCase()  message.button?.payload  message.interactive?.button_reply?.id || '';

      const PHONE_ID = process.env.PHONE_ID;
      const WA_TOKEN = process.env.WA_TOKEN;

      const sendButtons = async (to, bodyText, buttons) => {
        await fetch(https://graph.facebook.com/v20.0/${PHONE_ID}/messages, {
          method: 'POST',
          headers: {
            'Authorization': Bearer ${WA_TOKEN},
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'interactive',
            interactive: {
              type: 'button',
              body: { text: bodyText },
              action: { buttons: buttons }
            }
          })
        });
      };

      const sendText = async (to, text) => {
        await fetch(https://graph.facebook.com/v20.0/${PHONE_ID}/messages, {
          method: 'POST',
          headers: {
            'Authorization': Bearer ${WA_TOKEN},
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            text: { body: text }
          })
        });
      };

      // BOT FLOW
      if (['hi','hello','hey','start'].includes(userText)) {
        await sendButtons(from, "Welcome to Glam Salon Colombo 💅✨\n\nChoose your service:", [
          { type: 'reply', reply: { id: 'haircut', title: '💇 Hair Cut' } },
          { type: 'reply', reply: { id: 'color', title: '🎨 Hair Color' } },
          { type: 'reply', reply: { id: 'nails', title: '💅 Nails' } }
        ]);
      } else if (['haircut','color','nails'].includes(userText)) {
        await sendButtons(from, You selected *${userText.toUpperCase()}* 💈\nChoose date:, [
          { type: 'reply', reply: { id: 'date_2026-10-24', title: 'Oct 24' } },
          { type: 'reply', reply: { id: 'date_2026-10-25', title: 'Oct 25' } },
          { type: 'reply', reply: { id: 'date_2026-10-26', title: 'Oct 26' } }
        ]);
      } else if (userText.startsWith('date_')) {
        await sendButtons(from, 📅 Date: *${userText.replace('date_','')}*\nChoose time:, [
          { type: 'reply', reply: { id: 'time_10am', title: '10:00 AM' } },
          { type: 'reply', reply: { id: 'time_2pm', title: '02:00 PM' } },
          { type: 'reply', reply: { id: 'time_4pm', title: '04:00 PM' } }
        ]);
      } else if (userText.startsWith('time_')) {
        await sendText(from, "Perfect! 🙏 Send your NAME to confirm.\nExample: Nimali");
      } else {
        await sendText(from, ✅ *Booking Confirmed*\n\n👤 Name: ${userText}\n📍 Glam Salon, Colombo\n\nReminder will be sent. - Team CLEMAZ ❤️);
      }

      return res.status(200).send('ok');
    } catch (e) {
      console.error(e);
      return res.status(200).send('ok');
    }
  }
}
