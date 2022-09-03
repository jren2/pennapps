const express = require('express')
const upload = require('./router/upload')
const app = express()

app.use(express.json())
app.use(express.static('dist'))


app.use('/upload', upload)
app.use((err, req, res, next) => {
  res.status(500).send(`Something broke! Reason: ${err.message}`)
})

// set favicon
app.get('/favicon.ico', (req, res) => {
  res.status(404).send()
})

// set the initial entry point
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(3001, () => {
  // eslint-disable-next-line no-console
  console.log('listening on 3001')
})
