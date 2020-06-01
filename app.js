const express = require('express')
const mongoose = require('mongoose')

const app = express()

//Routes
const itemListRouter = require('./routes/itemList');
const itemDetailRouter = require('./routes/itemDetail');

app.use('/ItemList', itemListRouter)
app.use('/ItemDetail', itemDetailRouter)


const PORT = process.env.PORT || '3000'
app.listen(PORT, console.log(`Listening on port ${PORT}`))