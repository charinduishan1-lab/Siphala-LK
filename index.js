{ type: 'reply', reply: { id: 'time_2pm', title: '02:00 PM' } },
          { type: 'reply', reply: { id: 'time_4pm', title: '04:00 PM' } }
        ]);
      } 
      else if (text.startsWith('time_')) {
        await sendText(from, "Perfect! 🙏\n\nPlease type your *NAME* to confirm booking.\n\nExample: Nimali Perera");
      } 
      else {
        // Treat as name
        const customerName = msg.text?.body || 'Customer';
        await sendText(from, 
✅ *Booking Confirmed - Siphala LK* ✅

👤 Name: ${customerName}
📍 Location: Colombo 7
💈 Service: Premium Salon Service

Your slot is reserved. We will send you a reminder 2 hours before.

Thank you for choosing us! ❤️
- Team Siphala LK

Type *Hi* to book another.
        );
        // TODO: Add Google Sheet save here later
      }

      return res.status(200).send('ok');
    } catch (err) {
      console.error('Error:', err);
      return res.status(200).send('ok');
    }
  }

  return res.status(405).send('Method not allowed');
}
