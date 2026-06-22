const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// ===================================================================
// SIPHALA.LK DATA - siphalalk.vercel.app
// ===================================================================
const SIPHALA_DATA = {
  name: 'SIPHLA LK',
  url: 'https://siphalalk.vercel.app',
  about: 'Grade 3 ඉඳන් A/L දක්වා School Syllabus, Past Papers සහ YouTube Lessons නොමිලේ.',
  phone: '071 474 9893',
  syllabus: {
    '3': { name: '3 ශ්‍රේණිය', subjects: { 'Sinhala': { name: 'සිංහල', lessons: [] } } },
    '4': { name: '4 ශ්‍රේණිය', subjects: { 'Sinhala': { name: 'සිංහල', lessons: [] } } },
    '5': { name: '5 ශ්‍රේණිය', subjects: { 'Scholarship': { name: 'ශිෂ්‍යත්ව', lessons: [] } } },
    '6': { name: '6 ශ්‍රේණිය', subjects: { 'Science': { name: 'විද්‍යාව', lessons: [] } } },
    '7': { name: '7 ශ්‍රේණිය', subjects: { 'Science': { name: 'විද්‍යාව', lessons: [] } } },
    '8': { name: '8 ශ්‍රේණිය', subjects: { 'Science': { name: 'විද්‍යාව', lessons: [] } } },
    '9': { name: '9 ශ්‍රේණිය', subjects: { 'Science': { name: 'විද්‍යාව', lessons: [] } } },
    '10': {
      name: '10 ශ්‍රේණිය',
      subjects: {
        'Buddhism': { name: 'බුද්ධ ධර්මය', lessons: [{ no: 8, title: 'අනුසස් දැක සිල්වත් වෙමු', youtube: 'https://youtube.com/watch?v=REPLACE_ME', pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_8.pdf' }] },
        'Science': { name: 'විද්‍යාව', lessons: [] },
        'Maths': { name: 'ගණිතය', lessons: [] }
      }
    },
    '11': {
      name: '11 ශ්‍රේණිය',
      subjects: {
        'Science': { name: 'විද්‍යාව', lessons: [] },
        'Maths': { name: 'ගණිතය', lessons: [] },
        'History': { name: 'ඉතිහාසය', lessons: [] }
      }
    },
    'A/L-Science': {
      name: 'උසස් පෙළ - විද්‍යා',
      subjects: { 'Physics': { name: 'භෞතික විද්‍යාව', lessons: [] }, 'Chemistry': { name: 'රසායන විද්‍යාව', lessons: [] } }
    },
    'A/L-Arts': { name: 'උසස් පෙළ - කලා', subjects: { 'Sinhala': { name: 'සිංහල', lessons: [] } } },
    'A/L-Commerce': { name: 'උසස් පෙළ - වාණිජ', subjects: { 'Accounting': { name: 'ගිණුම්කරණය', lessons: [] } } }
  },
  pastPapers: {
    'Grade 5 Scholarship': 'https://siphalalk.vercel.app/papers/scholarship',
    'O/L': 'https://siphalalk.vercel.app/papers/ol',
    'A/L': 'https://siphalalk.vercel.app/papers/al'
  }
};
// ===================================================================

async function sendWhatsAppMessage(to, data) {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      { messaging_product: 'whatsapp', to,...data },
      { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } }
    );
  } catch (error) {
    console.error('Send Error:', error.response?.data?.error || error.message);
  }
}

app.get('/webhook', (req, res) => {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) res.status(200).send(challenge);
  else res.status(403).send('Forbidden');
});

app.post('/webhook', async (req, res) => {
  const body = req.body;
  if (!body.object) return res.sendStatus(404);
  const entry = body.entry[0].changes[0].value;
  const message = entry.messages?.[0];
  const from = message?.from;
  if (!message) return res.status(200).send('EVENT_RECEIVED');

  console.log(`📩 New Message from ${from}:`, message.text?.body || message.interactive?.button_reply?.id || message.interactive?.list_reply?.id);

  if (message.type === 'interactive') {
    const buttonId = message.interactive.button_reply?.id || message.interactive.list_reply?.id;

    // 👇 FIX 1: grade_list Handle කලා
    if (buttonId === 'main_menu') await sendMainMenu(from);
    else if (buttonId === 'grade_list') await sendGradeList(from); // මේ Line එක තිබ්බේ නෑ
    else if (buttonId.startsWith('grade_')) await sendSubjectMenu(from, buttonId.replace('grade_', ''));
    else if (buttonId.startsWith('subject_')) { const [, grade, subject] = buttonId.split('_'); await sendLessonList(from, grade, subject); }
    else if (buttonId.startsWith('lesson_')) { const [, grade, subject, lessonNo] = buttonId.split('_'); await sendLessonDetails(from, grade, subject, lessonNo); }
    else if (buttonId.startsWith('video_')) await sendWhatsAppMessage(from, { type: 'text', text: { body: `▶️ YouTube Video:\n${buttonId.replace('video_', '')}` } });
    else if (buttonId.startsWith('pdf_')) await sendWhatsAppMessage(from, { type: 'text', text: { body: `📄 PDF Download:\n${buttonId.replace('pdf_', '')}` } });
    else if (buttonId === 'past_papers') await sendPastPapers(from);
    else if (buttonId === 'contact') await sendWhatsAppMessage(from, { type: 'text', text: { body: `📞 Contact Us:\n${SIPHALA_DATA.phone}\nWebsite: ${SIPHALA_DATA.url}` } });
    return res.status(200).send('EVENT_RECEIVED');
  }

  const msg_body = message.text?.body?.toLowerCase().trim() || '';
  if (['hi', 'hello', 'start', 'menu'].some(w => msg_body.includes(w))) await sendMainMenu(from);
  else if (msg_body.includes('grade')) await sendGradeList(from);
  else await sendWhatsAppMessage(from, { type: 'text', text: { body: `සමාවෙන්න, මට තේරුනේ නෑ 😅\n\nMenu එක ගන්න *hi* කියලා Type කරන්න` } });
  res.status(200).send('EVENT_RECEIVED');
});

// BOT FUNCTIONS
async function sendMainMenu(to) {
  await sendWhatsAppMessage(to, { type: 'interactive', interactive: { type: 'button', body: { text: `ආයුබෝවන්! *${SIPHALA_DATA.name}* එකට සාදරයෙන් පිළිගන්නවා 🙏\n\n${SIPHALA_DATA.about}` }, action: { buttons: [{ type: 'reply', reply: { id: 'grade_list', title: '📚 ශ්‍රේණියක් තෝරන්න' } }, { type: 'reply', reply: { id: 'past_papers', title: '📝 Past Papers' } }, { type: 'reply', reply: { id: 'contact', title: '📞 Contact Us' } }] } } });
}

async function sendGradeList(to) {
  const rows = Object.keys(SIPHALA_DATA.syllabus).map(grade => ({
    id: `grade_${grade}`,
    title: SIPHALA_DATA.syllabus[grade].name,
    description: `Syllabus බලන්න`
  }));
  await sendWhatsAppMessage(to, { type: 'interactive', interactive: { type: 'list', body: { text: '📚 *ඔයාගේ ශ්‍රේණිය තෝරන්න*' }, action: { button: 'Grades', sections: [{ title: 'ශ්‍රේණි', rows }] } } });
}

async function sendSubjectMenu(to, grade) {
  const subjects = SIPHALA_DATA.syllabus[grade].subjects;
  const buttons = Object.keys(subjects).slice(0, 3).map(sub => ({ type: 'reply', reply: { id: `subject_${grade}_${sub}`, title: subjects[sub].name.substring(0, 20) } }));
  await sendWhatsAppMessage(to, { type: 'interactive', interactive: { type: 'button', body: { text: `📘 *${SIPHALA_DATA.syllabus[grade].name}*\n\nSubject එකක් තෝරන්න:` }, action: { buttons } } });
}

async function sendLessonList(to, grade, subject) {
  const lessons = SIPHALA_DATA.syllabus[grade].subjects[subject].lessons;
  if (lessons.length === 0) return sendWhatsAppMessage(to, { type: 'text', text: { body: 'මේ Subject එකට තාම Lessons Add කරලා නෑ. ඉක්මනින්ම දාන්නම්!' } });
  const rows = lessons.map(lesson => ({ id: `lesson_${grade}_${subject}_${lesson.no}`, title: `${lesson.no} පාඩම`, description: lesson.title.substring(0, 72) }));
  await sendWhatsAppMessage(to, { type: 'interactive', interactive: { type: 'list', body: { text: `☸️ *${SIPHALA_DATA.syllabus[grade].subjects[subject].name} - ${grade} ශ්‍රේණිය*\n\nපාඩමක් තෝරන්න:` }, action: { button: 'Lessons', sections: [{ title: 'පාඩම්', rows }] } } });
}

async function sendLessonDetails(to, grade, subject, lessonNo) {
  const lesson = SIPHALA_DATA.syllabus[grade].subjects[subject].lessons.find(l => l.no == lessonNo);
  if (!lesson) return sendWhatsAppMessage(to, { type: 'text', text: { body: 'සමාවෙන්න, පාඩම හොයාගන්න බැරිවුණා 😅' } });
  await sendWhatsAppMessage(to, { type: 'interactive', interactive: { type: 'button', body: { text: `🎥 *${lesson.no} පාඩම: ${lesson.title}*\n\n*${grade} ශ්‍රේණිය - ${SIPHALA_DATA.syllabus[grade].subjects[subject].name}*` }, action: { buttons: [{ type: 'reply', reply: { id: `video_${lesson.youtube}`, title: '▶️ YouTube Video' } }, { type: 'reply', reply: { id: `pdf_${lesson.pdf}`, title: '📄 Download PDF' } }, { type: 'reply', reply: { id: 'main_menu', title: '🏠 Main Menu' } }] } } });
}

// 👇 FIX 2: Past Papers Link Bug එක හැදුවා
async function sendPastPapers(to) {
  let text = `📝 *Past Papers Download*\n\n`;
  Object.keys(SIPHALA_DATA.pastPapers).forEach(exam => {
    text += `*${exam}*: ${SIPHALA_DATA.pastPapers[exam]}\n\n`; // මෙතන හරි
  });
  text += `Website: ${SIPHALA_DATA.url}`;
  await sendWhatsAppMessage(to, { type: 'text', text: { body: text } });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, => console.log(`Siphala Bot running on port ${PORT}`));
