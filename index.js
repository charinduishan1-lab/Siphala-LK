const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// ===================================================================
// EDIT THIS PART: උඹේ Siphala.lk Details ඔක්කොම මෙතන දාන්න
// ===================================================================
const SIPHALA_DATA = {
  platform: {
    name: 'SIPHLA LK',
    slogan: 'Sri Lanka\'s Smart Learning Platform',
    version: '2.0',
    language: 'si',
    country: 'Sri Lanka',
    established: 2025
  },

  contact: {
    website: 'https://siphalalk.vercel.app',
    phone: '0714749893',
    email: 'siphalakofficial@gmail.com',
    telegram: '@siphalalkbot',
    whatsapp: '94714749893',
    facebook: '',
    youtube: '',
    tiktok: ''
  },

  about: {
    short:
      'Grade 3 සිට A/L දක්වා නොමිලේ අධ්‍යාපනික සම්පත්.',

    full:
      `📚 School Syllabus
🎥 YouTube Video Lessons
📝 Past Papers
📄 PDFs
🎯 Scholarship Preparation
📈 Exam Revision

Vision:
Technology හරහා සෑම දරුවෙකුටම ගුණාත්මක අධ්‍යාපනය ලබාදීම.`,

    mission:
      'Make education accessible, engaging and effective for every student.'
  },

  features: [
    'Video Lessons',
    'Past Papers',
    'PDF Notes',
    'Scholarship Preparation',
    'Revision Papers',
    'Online Exams',
    'AI Learning Assistant'
  ],

  grades: {
    '3': {
      name: '3 ශ්‍රේණිය',
      category: 'Primary',
      subjects: {}
    },

    '4': {
      name: '4 ශ්‍රේණිය',
      category: 'Primary',
      subjects: {}
    },

    '5': {
      name: '5 ශ්‍රේණිය',
      category: 'Scholarship',
      subjects: {}
    },

    '6': {
      name: '6 ශ්‍රේණිය',
      category: 'Junior Secondary',
      subjects: {}
    },

    '7': {
      name: '7 ශ්‍රේණිය',
      category: 'Junior Secondary',
      subjects: {}
    },

    '8': {
      name: '8 ශ්‍රේණිය',
      category: 'Junior Secondary',
      subjects: {}
    },

    '9': {
      name: '9 ශ්‍රේණිය',
      category: 'Junior Secondary',
      subjects: {}
    },

    '10': {
      name: '10 ශ්‍රේණිය',
      category: 'O/L',
      subjects: {}
    },

    '11': {
      name: '11 ශ්‍රේණිය',
      category: 'O/L',
      subjects: {}
    },

    'A/L': {
      name: 'උසස් පෙළ',
      category: 'Advanced Level',
      streams: [
        'Science',
        'Commerce',
        'Arts',
        'Technology'
      ],
      subjects: {}
    }
  },

  pastPapers: {
    scholarship: {
      name: 'Scholarship',
      url: '/papers/scholarship'
    },

    ol: {
      name: 'O/L',
      url: '/papers/ol'
    },

    al: {
      name: 'A/L',
      url: '/papers/al'
    }
  },

  statistics: {
    totalGrades: 10,
    totalSubjects: 0,
    totalLessons: 0,
    totalVideos: 0,
    totalPdfs: 0
  }
};
// WhatsApp API Send Function
async function sendWhatsAppMessage(to, data) {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      { messaging_product: 'whatsapp', to: to,...data },
      { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } }
    );
  } catch (error) {
    console.error('Send Error:', error.response?.data || error.message);
  }
}

// 👇 1. Typing Indicator Function එක
async function showTyping(to, messageId) {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
        typing_indicator: { type: 'text' }
      },
      { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } }
    );
  } catch (error) {
    console.error('Typing Error:', error.response?.data || error.message);
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

  // 👇 2. Typing පෙන්නනවා + Delay එක
  await showTyping(from, message.id);
  await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s delay

  // 👇 3. Message Log කරනවා
  console.log(`📩 New Message from ${from}:`, message.text?.body || message.interactive?.button_reply?.id || message.interactive?.list_reply?.id);

  // Handle Button Clicks
  if (message.type === 'interactive') {
    const buttonId = message.interactive.button_reply?.id || message.interactive.list_reply?.id;

    // Main Menu Button
    if (buttonId === 'main_menu') {
      await sendMainMenu(from);
    }
    // Grade List
    else if (buttonId === 'grade_list') {
      await sendGradeList(from);
    }
    // Grade Selection
    else if (buttonId.startsWith('grade_')) {
      const grade = buttonId.replace('grade_', '');
      await sendSubjectMenu(from, grade);
    }
    // Subject Selection
    else if (buttonId.startsWith('subject_')) {
      const parts = buttonId.split('_');
      const grade = parts[1];
      const subject = parts.slice(2).join('_');
      await sendLessonList(from, grade, subject);
    }
    // Lesson Selection
    else if (buttonId.startsWith('lesson_')) {
      const parts = buttonId.split('_');
      const grade = parts[1];
      const subject = parts[2];
      const lessonNo = parts[3];
      await sendLessonDetails(from, grade, subject, lessonNo);
    }
    // Video Button
    else if (buttonId.startsWith('video_')) {
      const youtubeLink = buttonId.replace('video_', '');
      await sendWhatsAppMessage(from, { type: 'text', text: { body: `▶️ YouTube Video:\n${youtubeLink}` } });
    }
    // PDF Button
    else if (buttonId.startsWith('pdf_')) {
      const pdfLink = buttonId.replace('pdf_', '');
      await sendWhatsAppMessage(from, { type: 'text', text: { body: `📄 PDF Download:\n${pdfLink}` } });
    }
    // Past Papers
    else if (buttonId === 'past_papers') {
      await sendPastPapers(from);
    }
    // Contact
    else if (buttonId === 'contact') {
      await sendContact(from);
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
    description: `${grade} ශ්‍රේණියේ Syllabus බලන්න`
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
    reply: { id: `subject_${grade}_${sub}`, title: subjects[sub].name.substring(0, 20) }
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
  const lesson = SIPHALA_DATA.syllabus[grade].subjects[subject].lessons.find(l => l.no == lessonNo);

  if (!lesson) {
    return sendWhatsAppMessage(to, { type: 'text', text: { body: 'සමාවෙන්න, පාඩම හොයාගන්න බැරිවුණා 😅' } });
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
}

// 6. Past Papers - FIXED BUG HERE
async function sendPastPapers(to) {
  let text = `📝 *Past Papers Download*\n\n`;
  Object.keys(SIPHALA_DATA.pastPapers).forEach(exam => {
    text += `*${exam}*: ${SIPHALA_DATA.pastPapers[exam]}\n\n`; // 👈 මේක තමයි Bug එක. [exam] දැම්මා
  });
  text += `Website: ${SIPHALA_DATA.url}`;

  await sendWhatsAppMessage(to, { type: 'text', text: { body: text } });
}

// 7. Contact - UPDATED
async function sendContact(to) {
  await sendWhatsAppMessage(to, {
    type: 'text',
    text: {
      body: `📞 *Contact SIPHLA LK*\n\n` +
            `📱 Phone: ${SIPHALA_DATA.phone}\n` +
            `📧 Email: ${SIPHALA_DATA.email}\n` +
            `✈️ Telegram: ${SIPHALA_DATA.telegram}\n` +
            `🌐 Website: ${SIPHALA_DATA.url}\n\n` +
            `ඕනම ගැටලුවක් තියෙනවා නම් අපිට කතා කරන්න 🙏`
    }
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Siphala Advanced Bot running on port ${PORT}`));
