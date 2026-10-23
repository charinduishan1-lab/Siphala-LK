// Siphala LK - WhatsApp Salon Booking Bot
// Works on Vercel Serverless
// ENV needed: PHONE_ID, WA_TOKEN, VERIFY_TOKEN

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // 1. VERIFY WEBHOOK (Meta will call this)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'clemaz123';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
  }

  // 2. RECEIVE MESSAGES
  if (req.method === 'POST') {
    try {
      const body = req.body;
      const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
      if (!message) return res.status(200).send('ok');

      const from = message.from; // customer number
      let userText = '';

      if (message.type === 'text') userText = message.text.body.toLowerCase().trim();
      if (message.type === 'interactive') {
        userText = message.interactive.button_reply?.id  message.interactive.list_reply?.id  '';
      }

      const PHONE_ID = process.env.PHONE_ID;
      const WA_TOKEN = process.env.WA_TOKEN;

      // Helper: Send WhatsApp message
      const send = async (payload) => {
        await fetch(https://graph.facebook.com/v20.0/${PHONE_ID}/messages, {
          method: 'POST',
          headers: {
            'Authorization': Bearer ${WA_TOKEN},
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      };

      const sendText = (to, text) => send({
        messaging_product: 'whatsapp', to, text: { body: text }
      });

      const sendButtons = (to, bodyText, buttons) => send({
        messaging_product: 'whatsapp', to, type: 'interactive',
        interactive: {
          type: 'button',
          body: { text: bodyText },
          action: { buttons }
        }
      });

      // === BOT FLOW ===
      if (['hi','hello','hey','start','menu'].includes(userText)) {
        await sendButtons(from, "Welcome to Siphala LK Salon 💇‍♀️\n\nColombo's Premium Salon ✨\n\nChoose service:", [
          { type: 'reply', reply: { id: 'haircut', title: '💇 Hair Cut' } },
          { type: 'reply', reply: { id: 'color', title: '🎨 Hair Color' } },
          { type: 'reply', reply: { id: 'bridal', title: '👰 Bridal' } }
        ]);
      }
      else if (['haircut','color','bridal'].includes(userText)) {
        await sendButtons(from, You selected *${userText}* ✅\n\nPick a date:, [
          { type: 'reply', reply: { id: 'today', title: 'Today' } },
          { type: 'reply', reply: { id: 'tomorrow', title: 'Tomorrow' } },
          { type: 'reply', reply: { id: 'day_after', title: 'Day After' } }
        ]);
      }
      else if (['today','tomorrow','day_after'].includes(userText)) {
        await sendButtons(from, 📅 Date: ${userText}\n\nSelect time:, [
          { type: 'reply', reply: { id: '10am', title: '10:00 AM' } },
          { type: 'reply', reply: { id: '2pm', title: '2:00 PM' } },
          { type: 'reply', reply: { id: '4pm', title: '4:00 PM' } }
        ]);
      }
      else if (['10am','2pm','4pm'].includes(userText)) {
        await sendText(from, "Great! Almost done 🙏\n\nPlease type your *FULL NAME* to confirm.\nExample: Nimali Perera");
      }
      else {
        // Final confirmation
        const name = message.text?.body || 'Customer';
        await sendText(from, 
✅ *BOOKING CONFIRMED* ✅
Siphala LK Salon

👤 Name: ${name}
📍 Colombo 7
⏰ You will get reminder before appointment

Thank you! ❤️\n\nType *hi* for new booking.);
      }

      return res.status(200).send('ok');
    } catch (e) {
      console.error(e);
      return res.status(200).send('ok');
    }
  }
return res.status(405).send('Method not allowed');
}






