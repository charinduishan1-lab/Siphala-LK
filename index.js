// Send message helper
async function sendMessage(to, text, buttons) {
  await fetch(https://graph.facebook.com/v20.0/${process.env.PHONE_ID}/messages, {
    method: 'POST',
    headers: { 
      'Authorization': Bearer ${process.env.WA_TOKEN},
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      type: buttons ? "interactive" : "text",
      ...(buttons ? {
        interactive: {
          type: "button",
          body: { text: text },
          action: { buttons: buttons }
        }
      } : {
        text: { body: text }
      })
    })
  })
}

// Webhook handler
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Verification
    if (req.query['hub.verify_token'] === 'clemaz123') 
      return res.send(req.query['hub.challenge'])
  }
  
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
  if (!msg) return res.send('ok')

  const from = msg.from
  const text = msg.text?.body  msg.button?.payload  msg.interactive?.button_reply?.id

  // Simple state machine - store in DB/Sheet in real app
  if (text === 'Hi' || text.toLowerCase() === 'hi') {
    await sendMessage(from, "Welcome to Glam Salon 💇‍♀️ Choose service:", [
      { type: "reply", reply: { id: "haircut", title: "Hair Cut" } },
      { type: "reply", reply: { id: "color", title: "Hair Color" } },
      { type: "reply", reply: { id: "nails", title: "Nails" } }
    ])
  } else if (["haircut","color","nails"].includes(text)) {
    // Save service, ask date
    await sendMessage(from, "Choose date:", [
      { type: "reply", reply: { id: "2026-10-24", title: "Oct 24" } },
      { type: "reply", reply: { id: "2026-10-25", title: "Oct 25" } },
      { type: "reply", reply: { id: "2026-10-26", title: "Oct 26" } }
    ])
  }
  // ... continue flow

  res.send('ok')
}
