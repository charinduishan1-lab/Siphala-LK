const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// ===================================================================
// EDIT THIS PART: Add all your Siphala.lk details here
// ===================================================================
const SIPHALA_DATA = {
  name: 'SIPHALA LK',
  url: 'https://siphalalk.vercel.app',
  about: 'No. 1 E-Learning Platform\nFree School Syllabus, Past Papers, and YouTube Lessons from Grade 3 to A/L.\n\nVision: To redefine education through technology, making knowledge accessible and fun for every child.',
  phone: '071 474 9893',
  email: 'siphalalkofficial@gmail.com',
  telegram: 'siphalalk bot',

  // Grades + Subjects - Match the website structure
  syllabus: {
    '3': {
      name: 'Grade 3',
      subjects: {
        'Sinhala': { name: 'Sinhala', lessons: [] },
        'Maths': { name: 'Mathematics', lessons: [] },
        'Env': { name: 'Environment', lessons: [] }
      }
    },

    '4': {
      name: 'Grade 4',
      subjects: {
        'Sinhala': { name: 'Sinhala', lessons: [] },
        'Maths': { name: 'Mathematics', lessons: [] },
        'Env': { name: 'Environment', lessons: [] }
      }
    },

    '5': {
      name: 'Grade 5',
      subjects: {
        'Scholarship': {
          name: 'Scholarship - Practice Papers',
          lessons: [
            {
              no: 1,
              title: 'Practice Paper 1 | Online',
              youtube: 'https://youtube.com/watch?v=REPLACE_G5_P1',
              pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_1.pdf'
            },
            {
              no: 2,
              title: 'Practice Paper 2 | Online',
              youtube: 'https://youtube.com/watch?v=REPLACE_G5_P2',
              pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_2.pdf'
            },
            {
              no: 3,
              title: 'Practice Paper 3 | Online',
              youtube: 'https://youtube.com/watch?v=REPLACE_G5_P3',
              pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_3.pdf'
            },
            {
              no: 4,
              title: 'Practice Paper 4 | Online',
              youtube: 'https://youtube.com/watch?v=REPLACE_G5_P4',
              pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_4.pdf'
            },
            {
              no: 5,
              title: 'Practice Paper 5 | Online',
              youtube: 'https://youtube.com/watch?v=REPLACE_G5_P5',
              pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_5.pdf'
            },
            {
              no: 6,
              title: 'Practice Paper 6 | Online',
              youtube: 'https://youtube.com/watch?v=REPLACE_G5_P6',
              pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_6.pdf'
            },
            {
              no: 7,
              title: 'Practice Paper 7 | Online',
              youtube: 'https://youtube.com/watch?v=REPLACE_G5_P7',
              pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_7.pdf'
            },
            {
              no: 8,
              title: 'Practice Paper 8 | Online',
              youtube: 'https://youtube.com/watch?v=REPLACE_G5_P8',
              pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_8.pdf'
            },
            {
              no: 9,
              title: 'Practice Paper 9 | Online',
              youtube: 'https://youtube.com/watch?v=REPLACE_G5_P9',
              pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_9.pdf'
            },
            {
              no: 10,
              title: 'Practice Paper 10 | Online',
              youtube: 'https://youtube.com/watch?v=REPLACE_G5_P10',
              pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_10.pdf'
            },
            {
              no: 11,
              title: 'Practice Paper 11 | Online',
              youtube: 'https://youtube.com/watch?v=REPLACE_G5_P11',
              pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_11.pdf'
            },
            {
              no: 12,
              title: 'Practice Paper 12 | Online',
              youtube: 'https://youtube.com/watch?v=REPLACE_G5_P12',
              pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_12.pdf'
            },
            {
              no: 13,
              title: 'Practice Paper 13 | Online',
              youtube: 'https://youtube.com/watch?v=REPLACE_G5_P13',
              pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_13.pdf'
            },
            {
              no: 14,
              title: 'Practice Paper 14 | Online',
              youtube: 'https://youtube.com/watch?v=REPLACE_G5_P14',
              pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_14.pdf'
            },
            {
              no: 15,
              title: 'Practice Paper 15 | Online',
              youtube: 'https://youtube.com/watch?v=REPLACE_G5_P15',
              pdf: 'https://siphalalk.vercel.app/pdf/grade5_scholarship_15.pdf'
            }
          ]
        },

        'Sinhala': {
          name: 'Sinhala',
          lessons: []
        },

        'Maths': {
          name: 'Mathematics',
          lessons: []
        }
      }
    },

    '6': {
      name: 'Grade 6',
      subjects: {
        'Sinhala': { name: 'Sinhala', lessons: [] },
        'Maths': { name: 'Mathematics', lessons: [] },
        'Science': { name: 'Science', lessons: [] },
        'History': { name: 'History', lessons: [] }
      }
    },

    '7': {
      name: 'Grade 7',
      subjects: {
        'Sinhala': { name: 'Sinhala', lessons: [] },
        'Maths': { name: 'Mathematics', lessons: [] },
        'Science': { name: 'Science', lessons: [] },
        'History': { name: 'History', lessons: [] }
      }
    },

    '8': {
      name: 'Grade 8',
      subjects: {
        'Sinhala': { name: 'Sinhala', lessons: [] },
        'Maths': { name: 'Mathematics', lessons: [] },
        'Science': { name: 'Science', lessons: [] },
        'History': { name: 'History', lessons: [] }
      }
    },

    '9': {
      name: 'Grade 9',
      subjects: {
        'Sinhala': { name: 'Sinhala', lessons: [] },
        'Maths': { name: 'Mathematics', lessons: [] },
        'Science': { name: 'Science', lessons: [] },
        'History': { name: 'History', lessons: [] }
      }
    },

    '10': {
      name: 'Grade 10',
      subjects: {
        'Buddhism': {
          name: 'Buddhism',
          lessons: [
            {
              no: 1,
              title: 'The Bodhisattva Who Brings Comfort',
              youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_1',
              pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_1.pdf'
            },
            {
              no: 2,
              title: 'The Katina Ceremony',
              youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_2',
              pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_2.pdf'
            },
            {
              no: 3,
              title: 'Virtues That Create Good Children',
              youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_3',
              pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_3.pdf'
            },
            {
              no: 4,
              title: 'Those Who Progress Along the Path',
              youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_4',
              pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_4.pdf'
            },
            {
              no: 5,
              title: 'Let Us Identify Those Who Develop Insight',
              youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_5',
              pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_5.pdf'
            },
            {
              no: 6,
              title: 'Waving Goodbye to Samsaric Happiness',
              youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_6',
              pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_6.pdf'
            },
            {
              no: 7,
              title: 'Those Who Develop Dhamma Knowledge',
              youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_7',
              pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_7.pdf'
            },
            {
              no: 8,
              title: 'Let Us Become Virtuous by Seeing the Benefits',
              youtube: 'https://youtube.com/watch?v=REPLACE_LESSON_8',
              pdf: 'https://siphalalk.vercel.app/pdf/grade10_buddhism_8.pdf'
            }
          ]
        },

        'Science': {
          name: 'Science',
          lessons: []
        },

        'Maths': {
          name: 'Mathematics',
          lessons: []
        },

        'History': {
          name: 'History',
          lessons: []
        }
      }
    },

    '11': {
      name: 'Grade 11',
      subjects: {
        'Science': { name: 'Science', lessons: [] },
        'Maths': { name: 'Mathematics', lessons: [] },
        'History': { name: 'History', lessons: [] },
        'Buddhism': { name: 'Buddhism', lessons: [] }
      }
    },

    'A/L': {
      name: 'A/L',
      subjects: {
        'Physics': { name: 'Physics', lessons: [] },
        'Chemistry': { name: 'Chemistry', lessons: [] },
        'Biology': { name: 'Biology', lessons: [] },
        'Combined_Maths': { name: 'Combined Mathematics', lessons: [] },
        'Accounting': { name: 'Accounting', lessons: [] },
        'Business': { name: 'Business Studies', lessons: [] },
        'Sinhala': { name: 'Sinhala', lessons: [] }
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
      {
        messaging_product: 'whatsapp',
        to: to,
        ...data
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
        }
      }
    );
  } catch (error) {
    console.error(
      'Send Error:',
      error.response?.data || error.message
    );
  }
}

// 1. Typing Indicator Function
async function showTyping(to, messageId) {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
        typing_indicator: {
          type: 'text'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
        }
      }
    );
  } catch (error) {
    console.error(
      'Typing Error:',
      error.response?.data || error.message
    );
  }
}

// 1. Webhook Verify
app.get('/webhook', (req, res) => {
  const {
    'hub.mode': mode,
    'hub.verify_token': token,
    'hub.challenge': challenge
  } = req.query;

  if (
    mode === 'subscribe' &&
    token === process.env.VERIFY_TOKEN
  ) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});

// 2. Message Handler
app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (!body.object) {
    return res.sendStatus(404);
  }

  const entry = body.entry[0].changes[0].value;
  const message = entry.messages?.[0];
  const from = message?.from;

  if (!message) {
    return res.status(200).send('EVENT_RECEIVED');
  }

  // 2. Show typing indicator + Delay
  await showTyping(from, message.id);

  await new Promise(resolve =>
    setTimeout(resolve, 1500)
  );

  // 3. Log the message
  console.log(
    `📩 New Message from ${from}:`,
    message.text?.body ||
    message.interactive?.button_reply?.id ||
    message.interactive?.list_reply?.id
  );

  // Handle Button Clicks
  if (message.type === 'interactive') {
    const buttonId =
      message.interactive.button_reply?.id ||
      message.interactive.list_reply?.id;

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

      await sendLessonList(
        from,
        grade,
        subject
      );
    }

    // Lesson Selection
    else if (buttonId.startsWith('lesson_')) {
      const parts = buttonId.split('_');
      const grade = parts[1];
      const subject = parts[2];
      const lessonNo = parts[3];

      await sendLessonDetails(
        from,
        grade,
        subject,
        lessonNo
      );
    }

    // Video Button
    else if (buttonId.startsWith('video_')) {
      const youtubeLink =
        buttonId.replace('video_', '');

      await sendWhatsAppMessage(from, {
        type: 'text',
        text: {
          body:
            `▶️ YouTube Video:\n${youtubeLink}`
        }
      });
    }

    // PDF Button
    else if (buttonId.startsWith('pdf_')) {
      const pdfLink =
        buttonId.replace('pdf_', '');

      await sendWhatsAppMessage(from, {
        type: 'text',
        text: {
          body:
            `📄 PDF Download:\n${pdfLink}`
        }
      });
    }

    // Past Papers
    else if (buttonId === 'past_papers') {
      await sendPastPapers(from);
    }

    // Contact
    else if (buttonId === 'contact') {
      await sendContact(from);
    }

    return res
      .status(200)
      .send('EVENT_RECEIVED');
  }

  // Handle Text Messages
  const msg_body =
    message.text?.body?.toLowerCase().trim() || '';

  if (
    ['hi', 'hello', 'start', 'menu']
      .some(w => msg_body.includes(w))
  ) {
    await sendMainMenu(from);
  }

  else if (msg_body.includes('grade')) {
    await sendGradeList(from);
  }

  else {
    await sendWhatsAppMessage(from, {
      type: 'text',
      text: {
        body:
          `Sorry, I didn't understand that 😅\n\n` +
          `Type *hi* to open the menu.`
      }
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

      body: {
        text:
          `Hello! Welcome to *${SIPHALA_DATA.name}* 🙏\n\n` +
          `${SIPHALA_DATA.about}`
      },

      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'grade_list',
              title: '📚 Select a Grade'
            }
          },

          {
            type: 'reply',
            reply: {
              id: 'past_papers',
              title: '📝 Past Papers'
            }
          },

          {
            type: 'reply',
            reply: {
              id: 'contact',
              title: '📞 Contact Us'
            }
          }
        ]
      }
    }
  });
}

// 2. Grade List
async function sendGradeList(to) {
  const rows =
    Object.keys(SIPHALA_DATA.syllabus)
      .map(grade => ({
        id: `grade_${grade}`,
        title:
          SIPHALA_DATA.syllabus[grade].name,
        description:
          `View the ${grade} grade syllabus`
      }));

  await sendWhatsAppMessage(to, {
    type: 'interactive',
    interactive: {
      type: 'list',

      body: {
        text: '📚 *Select your grade*'
      },

      action: {
        button: 'Grades',

        sections: [
          {
            title: 'Syllabus',
            rows
          }
        ]
      }
    }
  });
}

// 3. Subject Menu
async function sendSubjectMenu(to, grade) {
  const subjects =
    SIPHALA_DATA.syllabus[grade].subjects;

  const buttons =
    Object.keys(subjects)
      .slice(0, 3)
      .map(sub => ({
        type: 'reply',

        reply: {
          id: `subject_${grade}_${sub}`,
          title:
            subjects[sub].name.substring(0, 20)
        }
      }));

  await sendWhatsAppMessage(to, {
    type: 'interactive',
    interactive: {
      type: 'button',

      body: {
        text:
          `📘 *${SIPHALA_DATA.syllabus[grade].name}*\n\n` +
          `Select a subject:`
      },

      action: {
        buttons
      }
    }
  });
}

// 4. Lesson List
async function sendLessonList(
  to,
  grade,
  subject
) {
  const lessons =
    SIPHALA_DATA
      .syllabus[grade]
      .subjects[subject]
      .lessons;

  if (lessons.length === 0) {
    return sendWhatsAppMessage(to, {
      type: 'text',
      text: {
        body:
          'Lessons have not been added for this subject yet. ' +
          'We will add them soon!'
      }
    });
  }

  const rows =
    lessons.map(lesson => ({
      id:
        `lesson_${grade}_${subject}_${lesson.no}`,

      title:
        `Lesson ${lesson.no}`,

      description:
        lesson.title.substring(0, 72)
    }));

  await sendWhatsAppMessage(to, {
    type: 'interactive',

    interactive: {
      type: 'list',

      body: {
        text:
          `☸️ *${SIPHALA_DATA.syllabus[grade].subjects[subject].name} - ${grade}*\n\n` +
          `Select a lesson:`
      },

      action: {
        button: 'Lessons',

        sections: [
          {
            title: 'Lessons',
            rows
          }
        ]
      }
    }
  });
}

// 5. Send Lesson Details: Video + PDF Buttons
async function sendLessonDetails(
  to,
  grade,
  subject,
  lessonNo
) {
  const lesson =
    SIPHALA_DATA
      .syllabus[grade]
      .subjects[subject]
      .lessons
      .find(l => l.no == lessonNo);

  if (!lesson) {
    return sendWhatsAppMessage(to, {
      type: 'text',
      text: {
        body:
          'Sorry, I could not find that lesson 😅'
      }
    });
  }

  await sendWhatsAppMessage(to, {
    type: 'interactive',

    interactive: {
      type: 'button',

      body: {
        text:
          `🎥 *Lesson ${lesson.no}: ${lesson.title}*\n\n` +
          `*${grade} - ${SIPHALA_DATA.syllabus[grade].subjects[subject].name}*`
      },

      action: {
        buttons: [
          {
            type: 'reply',

            reply: {
              id:
                `video_${lesson.youtube}`,

              title:
                '▶️ YouTube Video'
            }
          },

          {
            type: 'reply',

            reply: {
              id:
                `pdf_${lesson.pdf}`,

              title:
                '📄 Download PDF'
            }
          },

          {
            type: 'reply',

            reply: {
              id: 'main_menu',
              title: '🏠 Main Menu'
            }
          }
        ]
      }
    }
  });
}

// 6. Past Papers - FIXED BUG HERE
async function sendPastPapers(to) {
  let text =
    `📝 *Past Papers Download*\n\n`;

  Object.keys(
    SIPHALA_DATA.pastPapers
  ).forEach(exam => {
    text +=
      `*${exam}*: ${SIPHALA_DATA.pastPapers[exam]}\n\n`;
  });

  text +=
    `Website: ${SIPHALA_DATA.url}`;

  await sendWhatsAppMessage(to, {
    type: 'text',
    text: {
      body: text
    }
  });
}

// 7. Contact - UPDATED
async function sendContact(to) {
  await sendWhatsAppMessage(to, {
    type: 'text',

    text: {
      body:
        `📞 *Contact SIPHLA LK*\n\n` +
        `📱 Phone: ${SIPHALA_DATA.phone}\n` +
        `📧 Email: ${SIPHALA_DATA.email}\n` +
        `✈️ Telegram: ${SIPHALA_DATA.telegram}\n` +
        `🌐 Website: ${SIPHALA_DATA.url}\n\n` +
        `If you have any questions or problems, please contact us 🙏`
    }
  });
}

const PORT =
  process.env.PORT || 3000;

app.listen(
  PORT,
  () =>
    console.log(
      `Siphala Advanced Bot running on port ${PORT}`
    )
);
