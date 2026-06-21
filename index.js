require("dotenv").config();

const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ================== DATABASE ==================

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const userSchema = new mongoose.Schema({
  phone:String,
  name:String,
  grade:String,
  favorites:[String],
  lastLesson:String,
  totalMessages:{type:Number,default:0}
});

const User = mongoose.model("User",userSchema);

// ================== ANALYTICS ==================

let analytics = {
  users:0,
  messages:0,
  lessonsViewed:0
};

// ================== WEBSITE DATA ==================

let SIPHALA_DATA = {};

async function syncWebsiteData(){
  try{
      const response = await axios.get(
        "https://siphalalk.vercel.app/api/data"
      );

      SIPHALA_DATA = response.data;

      console.log("Website synced");
  }
  catch(err){
      console.log(err.message);
  }
}

// ================== WHATSAPP ==================

async function sendWhatsAppMessage(to,data){
  try{
    await axios.post(
      `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product:"whatsapp",
        to,
        ...data
      },
      {
        headers:{
          Authorization:`Bearer ${process.env.WHATSAPP_TOKEN}`
        }
      }
    );
  }
  catch(err){
    console.log(err.response?.data);
  }
}

// ================= AI =================

async function askAI(question){

 const response = await client.chat.completions.create({
   model:"gpt-4o-mini",
   messages:[
     {
       role:"system",
       content:"Answer according to Sri Lankan school syllabus."
     },
     {
       role:"user",
       content:question
     }
   ]
 });

 return response.choices[0].message.content;

}

// ================= SEARCH =================

function searchLessons(keyword){

 let results=[];

 Object.keys(SIPHALA_DATA.syllabus || {}).forEach(grade=>{

   Object.keys(
      SIPHALA_DATA.syllabus[grade].subjects
   ).forEach(subject=>{

      SIPHALA_DATA.syllabus[grade]
      .subjects[subject]
      .lessons
      .forEach(lesson=>{

          if(
            lesson.title
            .toLowerCase()
            .includes(keyword.toLowerCase())
          ){
              results.push({
                grade,
                subject,
                lesson
              });
          }

      });

   });

 });

 return results;

}
