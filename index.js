const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// ============================================================
// ADMIN FORM
// ============================================================

app.get('/admin', (req, res) => {
  const grades = Object.keys(SIPHALA_DATA.syllabus);

  let gradeOptions = '';

  grades.forEach(grade => {
    gradeOptions += `
      <option value="${grade}">
        ${SIPHALA_DATA.syllabus[grade].name}
      </option>
    `;
  });

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>SIPHALA LK - Admin Panel</title>

  <style>

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, sans-serif;
      background: #f3f4f6;
      min-height: 100vh;
      padding: 30px 15px;
    }

    .container {
      max-width: 650px;
      margin: auto;
    }

    .header {
      background: linear-gradient(
        135deg,
        #b433ff,
        #7b1fa2
      );

      color: white;
      padding: 25px;
      border-radius: 18px 18px 0 0;
      text-align: center;
    }

    .header h1 {
      font-size: 28px;
      margin-bottom: 8px;
    }

    .header p {
      opacity: 0.9;
    }

    .form-box {
      background: white;
      padding: 30px;
      border-radius: 0 0 18px 18px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    .form-group {
      margin-bottom: 18px;
    }

    label {
      display: block;
      font-weight: bold;
      margin-bottom: 7px;
      color: #333;
    }

    input,
    select {
      width: 100%;
      padding: 13px;
      border: 1px solid #ddd;
      border-radius: 10px;
      font-size: 15px;
      outline: none;
    }

    input:focus,
    select:focus {
      border-color: #b433ff;
      box-shadow: 0 0 0 3px rgba(180,51,255,0.1);
    }

    button {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 10px;
      background: #b433ff;
      color: white;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }

    button:hover {
      background: #9625d8;
    }

    .message {
      margin-top: 20px;
      padding: 15px;
      border-radius: 10px;
      background: #ecfdf5;
      color: #047857;
      text-align: center;
    }

    .warning {
      margin-top: 20px;
      padding: 15px;
      border-radius: 10px;
      background: #fff7ed;
      color: #c2410c;
      font-size: 14px;
    }

    @media (max-width: 600px) {

      body {
        padding: 15px 10px;
      }

      .form-box {
        padding: 20px;
      }

      .header h1 {
        font-size: 23px;
      }

    }

  </style>
</head>

<body>

  <div class="container">

    <div class="header">
      <h1>📚 SIPHALA LK</h1>
      <p>Admin - Add New Lesson</p>
    </div>

    <div class="form-box">

      <form method="POST" action="/admin/add-lesson">

        <div class="form-group">

          <label for="grade">
            Grade
          </label>

          <select
            id="grade"
            name="grade"
            required
            onchange="loadSubjects()"
          >

            <option value="">
              Select Grade
            </option>

            ${gradeOptions}

          </select>

        </div>


        <div class="form-group">

          <label for="subject">
            Subject
          </label>

          <select
            id="subject"
            name="subject"
            required
          >

            <option value="">
              Select Grade First
            </option>

          </select>

        </div>


        <div class="form-group">

          <label for="lessonNo">
            Lesson Number
          </label>

          <input
            type="number"
            id="lessonNo"
            name="lessonNo"
            min="1"
            placeholder="Example: 9"
            required
          >

        </div>


        <div class="form-group">

          <label for="title">
            Lesson Title
          </label>

          <input
            type="text"
            id="title"
            name="title"
            placeholder="Example: New Buddhism Lesson"
            required
          >

        </div>


        <div class="form-group">

          <label for="youtube">
            YouTube URL
          </label>

          <input
            type="url"
            id="youtube"
            name="youtube"
            placeholder="https://youtube.com/watch?v=..."
            required
          >

        </div>


        <div class="form-group">

          <label for="pdf">
            PDF URL
          </label>

          <input
            type="url"
            id="pdf"
            name="pdf"
            placeholder="https://siphalalk.vercel.app/pdf/lesson.pdf"
            required
          >

        </div>


        <button type="submit">
          ➕ Add Lesson
        </button>

      </form>


      <div class="warning">

        ⚠️ <strong>Important:</strong>
        This form currently stores the lesson in server memory.
        If the server restarts, newly added lessons will be lost.

      </div>

    </div>

  </div>


<script>

  const syllabus =
    ${JSON.stringify(SIPHALA_DATA.syllabus)};


  function loadSubjects() {

    const grade =
      document.getElementById('grade').value;

    const subjectSelect =
      document.getElementById('subject');

    subjectSelect.innerHTML =
      '<option value="">Select Subject</option>';


    if (!grade || !syllabus[grade]) {
      return;
    }


    const subjects =
      syllabus[grade].subjects;


    Object.keys(subjects).forEach(subject => {

      const option =
        document.createElement('option');

      option.value = subject;

      option.textContent =
        subjects[subject].name;

      subjectSelect.appendChild(option);

    });

  }

</script>

</body>
</html>
  `);
});


// ============================================================
// ADD LESSON FROM ADMIN FORM
// ============================================================

app.post('/admin/add-lesson', (req, res) => {

  try {

    const {
      grade,
      subject,
      lessonNo,
      title,
      youtube,
      pdf
    } = req.body;


    // Check grade

    if (!SIPHALA_DATA.syllabus[grade]) {

      return res.status(400).send(
        'Invalid grade.'
      );

    }


    // Check subject

    if (
      !SIPHALA_DATA
        .syllabus[grade]
        .subjects[subject]
    ) {

      return res.status(400).send(
        'Invalid subject.'
      );

    }


    const lessons =
      SIPHALA_DATA
        .syllabus[grade]
        .subjects[subject]
        .lessons;


    // Check duplicate lesson number

    const alreadyExists =
      lessons.some(
        lesson =>
          Number(lesson.no) === Number(lessonNo)
      );


    if (alreadyExists) {

      return res.status(400).send(`
        <h2>❌ Lesson already exists</h2>
        <p>Lesson ${lessonNo} already exists.</p>
        <br>
        <a href="/admin">Go Back</a>
      `);

    }


    // Add lesson

    lessons.push({

      no: Number(lessonNo),

      title: title.trim(),

      youtube: youtube.trim(),

      pdf: pdf.trim()

    });


    console.log(
      `✅ New lesson added:
      Grade: ${grade}
      Subject: ${subject}
      Lesson: ${lessonNo}`
    );


    res.send(`

<!DOCTYPE html>

<html>

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Lesson Added</title>

  <style>

    body {
      font-family: Arial, sans-serif;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }

    .box {
      background: white;
      max-width: 500px;
      width: 100%;
      padding: 35px;
      border-radius: 18px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .success {
      font-size: 60px;
      margin-bottom: 15px;
    }

    h1 {
      color: #16a34a;
      margin-bottom: 15px;
    }

    p {
      color: #555;
      margin-bottom: 25px;
      line-height: 1.6;
    }

    a {
      display: inline-block;
      padding: 12px 20px;
      background: #b433ff;
      color: white;
      text-decoration: none;
      border-radius: 10px;
      font-weight: bold;
    }

  </style>

</head>

<body>

  <div class="box">

    <div class="success">
      ✅
    </div>

    <h1>Lesson Added!</h1>

    <p>

      <strong>
        ${title}
      </strong>

      has been successfully added.

      <br><br>

      Grade:
      <strong>${SIPHALA_DATA.syllabus[grade].name}</strong>

      <br>

      Subject:
      <strong>
        ${SIPHALA_DATA.syllabus[grade].subjects[subject].name}
      </strong>

      <br>

      Lesson:
      <strong>${lessonNo}</strong>

    </p>

    <a href="/admin">
      ➕ Add Another Lesson
    </a>

  </div>

</body>

</html>

    `);

  } catch (error) {

    console.error(
      'Admin Form Error:',
      error
    );

    res.status(500).send(
      'Server error while adding lesson.'
    );

  }

});
