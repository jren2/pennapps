const express = require('express')

const app = express()

app.use(express.json())
app.use(express.static('dist'))

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
