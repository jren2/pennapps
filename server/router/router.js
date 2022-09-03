const express = require('express')
const router = express.Router()

const api_key = '2b108jwkqQofJmQ1nbXABTe'

router.get('/remote', async (req, res, next) => {
  const { image } = req.body
  try {

  } catch (e) {
    next(new Error('an error occured while uploading an url'))
  }
})

router.post('/v2/identify/{project}', async (req, res, next) => {
  const { image, organs } = req.body
  try {
    const search_data = await Question.find()
    res.json(search_data)
  } catch (e) {
    next(e.message)
  }
})

module.exports = router