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
  about: 'No. 1 E-Learning Platform\nGrade 3 ඉඳන් A/L දක්වා School Syllabus, Past Papers සහ YouTube Lessons නොමිලේ.\n\nVision: To redefine education through technology, making knowledge accessible and fun for every child.',
  phone: '071 474 9893',
  email: 'siphalakofficial@gmail.com',
  telegram: 'siphalalk bot',

  // Grades + Subjects - Website එකට Match වෙන විදියට
  syllabus: {
    '3': { name: '3 ශ්‍රේණිය', subjects: { 'Sinhala': { name: 'සිංහල', lessons: [] }, 'Maths': { name: 'ගණිතය', lessons: [] }, 'Env': { name: 'පරිසරය', lessons: [] } } },
    '4': { name: '4 ශ්‍රේණිය', subjects: { 'Sinhala': { name: 'සිංහල', lessons: [] }, 'Maths': { name: 'ගණිතය', lessons: [] }, 'Env': { name: 'පරිසරය', lessons: [] } } },
    '5': {
      name: '5 ශ්‍රේණිය',
      subjects: {
        'Scholarship': {
          name: 'ශිෂ්‍යත්ව - පෙරහුරු ප්‍රශ්න පත්‍ර',
          lessons: [
            { no: 1, title: 'ප්‍රශ්න පත්‍ර 1 | Online', youtube: 'https://youtube.com/watch?v=REPLACE_G5_P1', pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_1.pdf' },
            { no: 2, title: 'ප්‍රශ්න පත්‍ර 2 | Online', youtube: 'https://youtube.com/watch?v=REPLACE_G5_P2', pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_2.pdf' },
            { no: 3, title: 'ප්‍රශ්න පත්‍ර 3 | Online', youtube: 'https://youtube.com/watch?v=REPLACE_G5_P3', pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_3.pdf' },
            { no: 4, title: 'ප්‍රශ්න පත්‍ර 4 | Online', youtube: 'https://youtube.com/watch?v=REPLACE_G5_P4', pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_4.pdf' },
            { no: 5, title: 'ප්‍රශ්න පත්‍ර 5 | Online', youtube: 'https://youtube.com/watch?v=REPLACE_G5_P5', pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_5.pdf' },
            { no: 6, title: 'ප්‍රශ්න පත්‍ර 6 | Online', youtube: 'https://youtube.com/watch?v=REPLACE_G5_P6', pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_6.pdf' },
            { no: 7, title: 'ප්‍රශ්න පත්‍ර 7 | Online', youtube: 'https://youtube.com/watch?v=REPLACE_G5_P7', pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_7.pdf' },
            { no: 8, title: 'ප්‍රශ්න පත්‍ර 8 | Online', youtube: 'https://youtube.com/watch?v=REPLACE_G5_P8', pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_8.pdf' },
            { no: 9, title: 'ප්‍රශ්න පත්‍ර 9 | Online', youtube: 'https://youtube.com/watch?v=REPLACE_G5_P9', pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_9.pdf' },
            { no: 10, title: 'ප්‍රශ්න පත්‍ර 10 | Online', youtube: 'https://youtube.com/watch?v=REPLACE_G5_P10', pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_10.pdf' },
            { no: 11, title: 'ප්‍රශ්න පත්‍ර 11 | Online', youtube: 'https://youtube.com/watch?v=REPLACE_G5_P11', pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_11.pdf' },
            { no: 12, title: 'ප්‍රශ්න පත්‍ර 12 | Online', youtube: 'https://youtube.com/watch?v=REPLACE_G5_P12', pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_12.pdf' },
            { no: 13, title: 'ප්‍රශ්න පත්‍ර 13 | Online', youtube: 'https://youtube.com/watch?v=REPLACE_G5_P13', pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_13.pdf' },
            { no: 14, title: 'ප්‍රශ්න පත්‍ර 14 | Online', youtube: 'https://youtube.com/watch?v=REPLACE_G5_P14', pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_14.pdf' },
            { no: 15, title: 'ප්‍රශ්න පත්‍ර 15 | Online', youtube: 'https://youtube.com/watch?v=REPLACE_G5_P15', pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_15.pdf' }
          ]
        },
        'Sinhala': { name: 'සිංහල', lessons: [] },
        'Maths': { name: 'ගණිතය', lessons: [] }
      }
    },
    '6': { name: '6 ශ්‍රේණිය', subjects: { 'Sinhala': { name: 'සිංහල', lessons: [] }, 'Maths': { name: 'ගණිතය', lessons: [] }, 'Science': { name: 'විද්‍යාව', lessons: [] }, 'History': { name: 'ඉතිහාසය', lessons: [] } } },
    '7': { name: '7 ශ්‍රේණිය', subjects: { 'Sinhala': { name: 'සිංහල', lessons: [] }, 'Maths': { name: 'ගණිතය', lessons: [] }, 'Science': { name: 'විද්‍යාව', lessons: [] }, 'History': { name: 'ඉතිහාසය', lessons: [] } } },
    '8': { name: '8 ශ්‍රේණිය', subjects: { 'Sinhala': { name: 'සිංහල', lessons: [] }, 'Maths': { name: 'ගණිතය', lessons: [] }, 'Science': { name: 'විද්‍යාව', lessons: [] }, 'History': { name: 'ඉතිහාසය', lessons: [] } } },
    '9': { name: '9 ශ්‍රේණිය', subjects: { 'Sinhala': { name: 'සිංහල', lessons: [] }, 'Maths': { name: 'ගණිතය', lessons: [] }, 'Science': { name: 'විද්‍යාව', lessons: [] }, 'History': { name: 'ඉතිහාසය', lessons: [] } } },
    '10': {
      name: '10 ශ්‍රේණිය',
      subjects: {
        'Buddhism': {
          name: 'බුද්ධ ධර්මය',
          lessons: [
            { no: 1, title: 'අතියෙන් සැනහී සිටින බෝසතාණෝ', youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_1', pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_1.pdf' },
            { no: 2, title: 'කඨින පූජා මහෝත්සවය', youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_2', pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_2.pdf' },
            { no: 3, title: 'යහපත් දරුවන් හදන ගුණ', youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_3', pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_3.pdf' },
            { no: 4, title: 'සර දිග වඩින අය', youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_4', pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_4.pdf' },
            { no: 5, title: 'විදසුන් වඩවන අය හඳුනා ගනිමු', youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_5', pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_5.pdf' },
            { no: 6, title: 'සසර සැප සැපතට අත වනා', youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_6', pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_6.pdf' },
            { no: 7, title: 'බණ දහම් දියුණු කරන අය', youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_7', pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_7.pdf' },
            { no: 8, title: 'අනුසස් දැක සිල්වත් වෙමු', youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_8', pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_8.pdf' }
          ]
        },
        'Science': { name: 'විද්‍යාව', lessons: [] },
        'Maths': { name: 'ගණිතය', lessons: [] },
        'History': { name: 'ඉතිහාසය', lessons: [] }
      }
    },
    '11': {
      name: '11 ශ්‍රේණිය',
      subjects: {
        'Science': { name: 'විද්‍යාව', lessons: [] },
        'Maths': { name: 'ගණිතය', lessons: [] },
        'History': { name: 'ඉතිහාසය', lessons: [] },
        'Buddhism': { name: 'බුද්ධ ධර්මය', lessons: [] }
      }
    },
    'A/L': {
      name: 'උසස් පෙළ',
      subjects: {
        'Physics': { name: 'භෞතික විද්‍යාව', lessons: [] },
        'Chemistry': { name: 'රසායන විද්‍යාව', lessons: [] },
        'Biology': { name: 'ජීව විද්‍යාව', lessons: [] },
        'Combined_Maths': { name: 'සංයුක්ත ගණිතය', lessons: [] },
        'Accounting': { name: 'ගිණුම්කරණය', lessons: [] },
        'Business': { name: 'ව්‍යාපාර අධ්‍යයනය', lessons: [] },
        'Sinhala': { name: 'සිංහල', lessons: [] }
      }
    }
  },

  pastPapers: {
    'A/L': 'https://siphalalk.vercel.app/papers/al',
    'O/L': 'https://siphalalk.vercel.app/papers/ol',
    'Scholarship': 'https://siphalalk.vercel.app/papers/scholarship'
  }
};
// ===================================================================

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
