const express = require('express')
const config = require('./utils/config')
const bodyparser = require('body-parser')

const app = express()

app.use(bodyparser.json())

//Routes
// TODO: Sort Ingredients into groups and add ability to grab prices for groups
const apiRouter = require('./routes/api')
const mpCloneRouter = require('./routes/mpClone')

app.use('/api', apiRouter)
app.use('/marketplace-clone', mpCloneRouter)

const PORT = config.PORT || '3000'
app.listen(PORT, console.log(`Listening on port ${PORT}`))
