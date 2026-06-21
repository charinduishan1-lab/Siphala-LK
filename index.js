const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// ===================================================================
// EDIT THIS PART: උඹේ Siphala.lk Details ඔක්කොම මෙතන දාන්න
// ===================================================================
const SIPHALA_DATA = {
  name: 'SIPHLA LK',
  url: 'https://siphalalk.vercel.app',
  about: 'Grade 3 ඉඳන් A/L දක්වා School Syllabus, Past Papers සහ YouTube Lessons නොමිලේ.',
  phone: '071 474 9893',

  // Grades + Subjects
  syllabus: {
    '10': {
      name: '10 ශ්‍රේණිය',
      subjects: {
        'Buddhism': {
          name: 'බුද්ධ ධර්මය',
          lessons: [
            {
              no: 8,
              title: 'අනුසස් දැක සිල්වත් වෙමු',
              youtube: 'https://youtube.com/watch?v=REPLACE_ME', // ඇත්ත Video Link
              pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_8.pdf' // ඇත්ත PDF Link
            },
            // තව Lessons Add කරන්න
            // { no: 7, title: '...', youtube: '...', pdf: '...' }
          ]
        }
      }
    },
    '11': {
      name: '11 ශ්‍රේණිය',
      subjects: {
        'Science': { name: 'විද්‍යාව', lessons: [] }
      }
    },
    'A/L': {
      name: 'උසස් පෙළ',
      subjects: {
        'Physics': { name: 'භෞතික විද්‍යාව', lessons: [] }
      }
    }
  },

  pastPapers: {
    'O/L': 'https://siphalalk.vercel.app/papers/ol',
    'A/L': 'https://siphalalk.vercel.app/papers/al',
    'Scholarship': 'https://siphalalk.vercel.app/papers/scholarship'
  }
};
// ===================================================================

// WhatsApp API Send Function
async function sendWhatsAppMessage(to, data) {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      { messaging_product: 'whatsapp', to,...data },
      { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } }
    );
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// 1. Webhook Verify
app.get('/webhook', (req, res) => {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});

// 2. Message Handler
app.post('/webhook', async (req, res) => {
  const body = req.body;
  if (!body.object) return res.sendStatus(404);

  const entry = body.entry[0].changes[0].value;
  const message = entry.messages?.[0];
  const from = message?.from;

  if (!message) return res.status(200).send('EVENT_RECEIVED');

  // Handle Button Clicks
  if (message.type === 'interactive') {
    const buttonId = message.interactive.button_reply?.id || message.interactive.list_reply?.id;

    // Main Menu Button
    if (buttonId === 'main_menu') {
  await sendMainMenu(from);
}
else if (buttonId === 'grade_list') {
  await sendGradeList(from);
}
else if (buttonId === 'contact') {
  await sendWhatsAppMessage(from, {
    type: 'text',
    text: {
      body: `📞 Contact Us\n\n${SIPHALA_DATA.phone}\n${SIPHALA_DATA.url}`
    }
  });
}
else if (buttonId.startsWith('grade_')) {
    // Grade Selection
    else if (buttonId.startsWith('grade_')) {
      const grade = buttonId.split('_')[1];
      await sendSubjectMenu(from, grade);
    }
    // Subject Selection
    else if (buttonId.startsWith('subject_')) {
      const [, grade, subject] = buttonId.split('_');
      await sendLessonList(from, grade, subject);
    }
    // Lesson Selection
    else if (buttonId.startsWith('lesson_')) {
      const [, grade, subject, lessonNo] = buttonId.split('_');
      await sendLessonDetails(from, grade, subject, lessonNo);
    }
    // Past Papers
    else if (buttonId === 'past_papers') {
      await sendPastPapers(from);
    }
    return res.status(200).send('EVENT_RECEIVED');
  }

  // Handle Text Messages
  const msg_body = message.text?.body?.toLowerCase().trim() || '';

  if (['hi', 'hello', 'start', 'menu'].some(w => msg_body.includes(w))) {
    await sendMainMenu(from);
  }
  else if (msg_body.includes('grade')) {
    await sendGradeList(from);
  }
  else {
    await sendWhatsAppMessage(from, {
      type: 'text',
      text: { body: `සමාවෙන්න, මට තේරුනේ නෑ 😅\n\nMenu එක ගන්න *hi* කියලා Type කරන්න` }
    });
  }

  res.status(200).send('EVENT_RECEIVED');
});

// ================== BOT FUNCTIONS ==================

// 1. Main Menu with Buttons
async function sendMainMenu(to) {
  await sendWhatsAppMessage(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: `ආයුබෝවන්! *${SIPHALA_DATA.name}* එකට සාදරයෙන් පිළිගන්නවා 🙏\n\n${SIPHALA_DATA.about}` },
      action: {
        buttons: [
          { type: 'reply', reply: { id: 'grade_list', title: '📚 ශ්‍රේණියක් තෝරන්න' } },
          { type: 'reply', reply: { id: 'past_papers', title: '📝 Past Papers' } },
          { type: 'reply', reply: { id: 'contact', title: '📞 Contact Us' } }
        ]
      }
    }
  });
}

// 2. Grade List
async function sendGradeList(to) {
  const rows = Object.keys(SIPHALA_DATA.syllabus).map(grade => ({
    id: `grade_${grade}`,
    title: SIPHALA_DATA.syllabus[grade].name,
    description: `Grade ${grade} Syllabus බලන්න`
  }));

  await sendWhatsAppMessage(to, {
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: '📚 *ඔයාගේ ශ්‍රේණිය තෝරන්න*' },
      action: {
        button: 'Grades',
        sections: [{ title: 'Syllabus', rows }]
      }
    }
  });
}

// 3. Subject Menu
async function sendSubjectMenu(to, grade) {
  const subjects = SIPHALA_DATA.syllabus[grade].subjects;
  const buttons = Object.keys(subjects).slice(0, 3).map(sub => ({
    type: 'reply',
    reply: { id: `subject_${grade}_${sub}`, title: subjects[sub].name }
  }));

  await sendWhatsAppMessage(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: `📘 *${SIPHALA_DATA.syllabus[grade].name}*\n\nSubject එකක් තෝරන්න:` },
      action: { buttons }
    }
  });
}

// 4. Lesson List
async function sendLessonList(to, grade, subject) {
  const lessons = SIPHALA_DATA.syllabus[grade].subjects[subject].lessons;
  if (lessons.length === 0) {
    return sendWhatsAppMessage(to, { type: 'text', text: { body: 'මේ Subject එකට තාම Lessons Add කරලා නෑ. ඉක්මනින්ම දාන්නම්!' } });
  }

  const rows = lessons.map(lesson => ({
    id: `lesson_${grade}_${subject}_${lesson.no}`,
    title: `${lesson.no} පාඩම`,
    description: lesson.title.substring(0, 72)
  }));

  await sendWhatsAppMessage(to, {
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: `☸️ *${SIPHALA_DATA.syllabus[grade].subjects[subject].name} - ${grade} ශ්‍රේණිය*\n\nපාඩමක් තෝරන්න:` },
      action: {
        button: 'Lessons',
        sections: [{ title: 'පාඩම්', rows }]
      }
    }
  });
}

// 5. Send Lesson Details: Video + PDF Buttons
async function sendLessonDetails(to, grade, subject, lessonNo) {
  const lesson = SIPHALA_DATA.syllabus[grade]
  .subjects[subject]
  .lessons.find(l => l.no == lessonNo);

if (!lesson) {
  return sendWhatsAppMessage(to, {
    type: 'text',
    text: {
      body: 'Lesson එක හමු වුනේ නැහැ.'
    }
  });
}

  await sendWhatsAppMessage(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: `🎥 *${lesson.no} පාඩම: ${lesson.title}*\n\n*${grade} ශ්‍රේණිය - ${SIPHALA_DATA.syllabus[grade].subjects[subject].name}*` },
      action: {
        buttons: [
          { type: 'reply', reply: { id: `video_${lesson.youtube}`, title: '▶️ YouTube Video' } },
          { type: 'reply', reply: { id: `pdf_${lesson.pdf}`, title: '📄 Download PDF' } },
          { type: 'reply', reply: { id: 'main_menu', title: '🏠 Main Menu' } }
        ]
      }
    }
  });

  // If user clicks video/pdf button, send the link
  // This part needs another handler, but for now we send links directly
}

// 6. Past Papers
async function sendPastPapers(to) {
  let text = `📝 *Past Papers Download*\n\n`;
  Object.keys(SIPHALA_DATA.pastPapers).forEach(exam => {
    text += `*${exam}*: ${SIPHALA_DATA.pastPapers[exam]}\n\n`;
  });
  text += `Website: ${SIPHALA_DATA.url}`;

  await sendWhatsAppMessage(to, { type: 'text', text: { body: text } });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Siphala Advanced Bot running on port ${PORT}`));
