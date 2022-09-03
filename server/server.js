// const upload = require('./router/upload')
const express = require('express')
const path = require('path')
const app = express()
const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data');

app.use(express.json())
app.use(express.static('dist'))

// set favicon
app.get('/favicon.ico', (req, res) => {
  res.status(404).send()
})

// app.use('/upload', upload)
app.use((err, req, res, next) => {
  res.status(500).send(`Something broke! Reason: ${err.message}`)
})

app.post('/local/identifyFlower/:image', async (req, res) => {
  const { params } = req

  // image must be a string path
  const { image } = params

  console.log('hello')
  res.send('hi')

  let form = new FormData();

  form.append('organs', 'leaf');
  form.append('images', fs.createReadStream(image));

  try {
    const { status, data } = await axios.post(
      'https://my-api.plantnet.org/v2/identify/all?api-key=2b108jwkqQofJmQ1nbXABTe',
      form, {
      headers: form.getHeaders()
    }
    );

    console.log('status', status); // should be: 200
    console.log('data', require('util').inspect(data, false, null, true)); // should be: read "Step 6" below
    res.send(data)
  } catch (error) {
    console.error('error', error);
  }
})

app.post('/remote/identifyFlower/:image/:organ', async (req, res) => {
  const { params } = req

  // image can be a regular url
  let { image, organ } = params

  image = encodeURIComponent(image)


  axios.get(`https://my-api.plantnet.org/v2/identify/all?api-key=2b108jwkqQofJmQ1nbXABTe&images=${image}&organs=${organ}`
  ).then((response) => {
    console.log(response.data)
    res.send(response.data)
  }).catch(err => {
    res.send(err)
  })
})

// set the initial entry point
app.get('/wiki', async (req, res) => {
  try {
    const sentiment = await wikiSentiment(req.query.name);
    console.log(sentiment);
    return res.json({ sentiment: sentiment });
  } catch (e) {
    console.error(e);
  }
})

// set the initial entry point
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(3001, () => {
  // eslint-disable-next-line no-console
  console.log('listening on 3001')
})
