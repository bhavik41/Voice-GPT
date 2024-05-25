const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const OpenAI = require('openai')

// const mySecret = process.env['key']
const mySecret = process.env ['key']
const openai = new OpenAI({
  apiKey: mySecret, // defaults to process.env["OPENAI_API_KEY"]
});
const messages = [];


async function main(input) {
  messages.push({ role: 'user', content: input })
  console.log(messages)
  const chatCompletion = await openai.chat.completions.create({
    messages : messages,  
    model: 'gpt-3.5-turbo',
  });

  // console.log(chatCompletion.choices);
  return chatCompletion.choices[0]?.message?.content
}

// app.use(bodyParser.urlencoded({ extended: true })): This line adds middleware to your Express application for parsing URL-encoded form data. When a client submits an HTML form with data (e.g., using a POST request), this middleware parses the form data and makes it available in your route handlers. The extended: true option allows you to parse complex objects and arrays within the form data.


//middleware configure
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Render Html File
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});


app.post('/api', async function (req, res, next) {
  console.log(req.body)
  const mes = await  main(req.body.input)
  res.json({success: true, message: mes})
})


app.listen(port, () => {
  // Code.....
})


const googleTTS = require('google-tts-api');

app.get('/tts', (req, res) => {
  const text = req.query.text;
  const lang = req.query.lang || 'en'; // Language (default to English)

  if (!text) {
    return res.status(400).json({ error: 'Text parameter is required.' });
  }

  // Generate TTS audio URL
  const audioURL = googleTTS(text, lang);

  // Redirect the client to the TTS audio URL
  res.redirect(audioURL);
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
