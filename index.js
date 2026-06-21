const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// ===================================================================
// CONFIG: උඹේ Details
// ===================================================================
const TOKEN = "EAAWk0lWWV7lBR0brllilV8a7NV1cGlVuCwz4hakRu34r8i7edh3p1OZChGH1vLlsZySuJR0wTJlK1Q0gnZCYfaLO9JLlXpunulTmgUjYZBKT4HmZBo0W5YZAaKAOeadAuwRFJ8UyRDToCHmeV94j9YZCMMU13qjxfE7ixyAPVJ3hm47UsITdFKEZCNONlcXlQZDZD";
const PHONE_ID = "1213351778520369";
const VERIFY = "siphala";
// ===================================================================

const URL = `https://graph.facebook.com/v18.0/${PHONE_ID}/messages`;
const users = {}; // User Data Store

const SIPHALA_DATA = {
  name: 'SIPHLA LK',
  url: 'https://siphalalk.vercel.app',
  about: 'Grade 3 ඉඳන් A/L දක්වා School Syllabus, Past Papers සහ YouTube Lessons නොමිලේ.',
  phone: '071 474 9893',
  email: 'siphalaikoffical@gmail.com',

  syllabus: {
    '6': { name: '6 ශ්‍රේණිය', subjects: { 'Maths': { name: 'ගණිතය', lessons: [] }, 'Science': { name: 'විද්‍යාව', lessons: [] } } },
    '7': { name: '7 ශ්‍රේණිය', subjects: { 'Maths': { name: 'ගණිතය', lessons: [] }, 'Science': { name: 'විද්‍යාව', lessons: [] } } },
    '8': { name: '8 ශ්‍රේණිය', subjects: { 'Maths': { name: 'ගණිතය', lessons: [] }, 'English': { name: 'ඉංග්‍රීසි', lessons: [] } } },
    '9': { name: '9 ශ්‍රේණිය', subjects: { 'Maths': { name: 'ගණිතය', lessons: [] }, 'Sinhala': { name: 'සිංහල', lessons: [] } } },
    '10': {
      name: '10 ශ්‍රේණිය',
      subjects: {
        'Buddhism': {
          name: 'බුද්ධ ධර්මය',
          lessons: [
            { no: 8, title: 'අනුසස් දැක සිල්වත් වෙමු', youtube: 'https://youtube.com/watch?v=dQw4w9WgXcQ', pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_8.pdf' },
            { no: 7, title: 'අපේ උරුමය', youtube: 'https://youtube.com/watch?v=abc123', pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_7.pdf' }
          ]
        },
        'Science': { name: 'විද්‍යාව', lessons: [] }
      }
    },
    '11': {
      name: '11 ශ්‍රේණිය',
      subjects: {
        'Science': { name: 'විද්‍යාව', lessons: [] },
        'Maths': { name: 'ගණිතය', lessons: [] }
      }
    },
    'A/L': {
      name: 'උසස් පෙළ',
      subjects: {
        'Physics': { name: 'භෞතික විද්‍යාව', lessons: [] },
        'Chemistry': { name: 'රසායන විද්‍යාව', lessons: [] },
        'Biology': { name: 'ජීව විද්‍යාව', lessons: [] }
      }
    }
  },

  pastPapers: {
    'O/L': 'https://siphalalk.vercel.app/papers/ol',
    'A/L': 'https://siphalalk.vercel.app/papers/al',
    'Scholarship': 'https://siphalalk.vercel.app/papers/scholarship'
  }
};

// Send Message Function
async function send(to, data, msgId = null) {
  try {
    const payload = { messaging_product: 'whatsapp', to,...data };
    if (msgId) payload.context = { message_id: msgId }; // Reply
    await axios.post(URL, payload, { headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch (e) {
    console.log('Send Error:', e.response?.data || e.message);
  }
}

// Send Reaction
async function sendReaction(to, msgId, emoji) {
  try {
    await axios.post(URL, {
      messaging_product: 'whatsapp', to, type: 'reaction',
      reaction: { message_id: msgId, emoji: emoji }
    }, { headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch (e) {
    console.log('Reaction Error:', e.response?.data || e.message);
  }
}

// Webhook Verify
app.get('/webhook', (req, res) => {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
  if (mode === 'subscribe' && token === VERIFY) res.status(200).send(challenge);
  else res.status(403).send('Forbidden');
});

// Message Handler
app.post('/webhook', async (req, res) => {
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg) return res.sendStatus(200);

  const from = msg.from;
  const msgId = msg.id;
  const name = req.body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name || 'User';

  // Save User
  if (!users[from]) {
    users[from] = { phone: from, name: name, joined: new Date().toISOString() };
    console.log('New User:', from, name);
  }

  // Handle Interactive
  if (msg.type === 'interactive') {
    const id = msg.interactive.button_reply?.id || msg.interactive.list_reply?.id;

    if (id === 'main_menu') return await mainMenu(from);
    if (id === 'grade_list') return await gradeList(from);
    if (id === 'past_papers') return await pastPapers(from);
    if (id === 'contact') return await contactUs(from);
    if (id.startsWith('grade_')) return await subjectMenu(from, id.split('_')[1]);
    if (id.startsWith('subject_')) return await lessonList(from, id.split('_')[1], id.split('_')[2]);
    if (id.startsWith('lesson_')) return await lessonDetails(from, id.split('_')[1], id.split('_')[2], id.split('_')[3]);
    if (id.startsWith('video_')) return await send(from, { type: 'text', text: { body: `▶️ *YouTube Video Link*\n\n${id.replace('video_','')}` } });
    if (id.startsWith('pdf_')) return await send(from, { type: 'text', text: { body: `📄 *PDF Download Link*\n\n${id.replace('pdf_','')}` } });
  }

  // Handle Text
  const text = msg.text?.body?.toLowerCase().trim() || '';
  if (['hi', 'hello', 'start', 'menu', 'හායි'].some(w => text.includes(w))) {
    await sendReaction(from, msgId, '👍');
    await mainMenu(from);
  }
  else if (text.includes('grade')) await gradeList(from);
  else await send(from, { type: 'text', text: { body: `සමාවෙන්න, මට තේරුනේ නෑ 😅\n\nMenu එක ගන්න *hi* කියලා Type කරන්න` } }, msgId);

  res.sendStatus(200);
});

// ================== BOT FUNCTIONS ==================

async function mainMenu(to) {
  await send(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: `ආයුබෝවන්! *${SIPHALA_DATA.name}* 🙏\n\n${SIPHALA_DATA.about}\n\n📱 *Bot එකේ Number එක Save කරගන්න:* ${SIPHALA_DATA.phone}` },
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

async function gradeList(to) {
  const rows = Object.keys(SIPHALA_DATA.syllabus).map(g => ({
    id: `grade_${g}`, title: SIPHALA_DATA.syllabus[g].name, description: `පාඩම් + PDF බලන්න`
  }));
  await send(to, {
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: '📚 *ඔයාගේ ශ්‍රේණිය තෝරන්න*' },
      action: { button: 'Grades', sections: [{ title: 'සියලුම ශ්‍රේණි', rows }] }
    }
  });
}

async function subjectMenu(to, grade) {
  const subs = SIPHALA_DATA.syllabus[grade].subjects;
  if (!Object.keys(subs).length) return await send(to, { type: 'text', text: { body: 'මේ ශ්‍රේණියට තාම Subjects Add කරලා නෑ. ඉක්මනින්ම දාන්නම්!' } });

  const buttons = Object.keys(subs).slice(0, 3).map(s => ({
    type: 'reply', reply: { id: `subject_${grade}_${s}`, title: subs[s].name.substring(0,20) }
  }));

  await send(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: `📘 *${SIPHALA_DATA.syllabus[grade].name}*\n\nSubject එකක් තෝරන්න:` },
      action: { buttons }
    }
  });
}

async function lessonList(to, grade, subject) {
  const lessons = SIPHALA_DATA.syllabus[grade].subjects[subject].lessons;
  if (!lessons.length) return await send(to, { type: 'text', text: { body: 'මේ Subject එකට තාම Lessons නෑ. ඉක්මනින්ම දාන්නම්!' } });

  const rows = lessons.map(l => ({
    id: `lesson_${grade}_${subject}_${l.no}`, title: `${l.no} පාඩම`, description: l.title.substring(0, 72)
  }));

  await send(to, {
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: `☸️ *${SIPHALA_DATA.syllabus[grade].subjects[subject].name} - ${grade} ශ්‍රේණිය*\n\nපාඩමක් තෝරන්න:` },
      action: { button: 'Lessons', sections: [{ title: 'පාඩම්', rows }] }
    }
  });
}

async function lessonDetails(to, grade, subject, lessonNo) {
  const l = SIPHALA_DATA.syllabus[grade].subjects[subject].lessons.find(x => x.no == lessonNo);
  if (!l) return await send(to, { type: 'text', text: { body: 'පාඩම හොයාගන්න බැරි උනා 😅' } });

  await send(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: `🎥 *${l.no} පාඩම: ${l.title}*\n\n*${grade} ශ්‍රේණිය - ${SIPHALA_DATA.syllabus[grade].subjects[subject].name}*` },
      action: {
        buttons: [
          { type: 'reply', reply: { id: `video_${l.youtube}`, title: '▶️ YouTube' } },
          { type: 'reply', reply: { id: `pdf_${l.pdf}`, title: '📄 PDF' } },
          { type: 'reply', reply: { id: 'main_menu', title: '🏠 Menu' } }
        ]
      }
    }
  });
}

async function pastPapers(to) {
  let text = `📝 *Past Papers Download*\n\n`;
  Object.keys(SIPHALA_DATA.pastPapers).forEach(e => {
    text += `*${e}*: ${SIPHALA_DATA.pastPapers[e]}\n\n`;
  });
  text += `🌐 Website: ${SIPHALA_DATA.url}\n📞 Phone: ${SIPHALA_DATA.phone}`;
  await send(to, { type: 'text', text: { body: text } });
}

async function contactUs(to) {
  await send(to, {
    type: 'text',
    text: { body: `📞 *Contact ${SIPHALA_DATA.name}*\n\nPhone: ${SIPHALA_DATA.phone}\nEmail: ${SIPHALA_DATA.email}\nWebsite: ${SIPHALA_DATA.url}\n\nසැකයක් තියෙනවනම් Call කරන්න හෝ Email එකක් දාන්න!` }
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Siphala Bot Running on Port ${PORT}`));
