const express = require('express')
const mongoose = require('mongoose')

const app = express()

//Routes
const itemListRouter = require('./routes/itemList');

app.use('/ItemList/', itemListRouter)


const PORT = process.env.PORT || '3000'
app.listen(PORT, console.log(`Listening on port ${PORT}`))