const express = require('express')
const mongoose = require('mongoose')

const app = express()

//Routes
const itemListRouter = require('./routes/itemList');
const itemInfoRouter = require('./routes/itemInfo');

app.use('/ItemList', itemListRouter)
app.use('/ItemInfo', itemInfoRouter)
app.use('/ItemPricing', itemPricingRouter)


const PORT = process.env.PORT || '3000'
app.listen(PORT, console.log(`Listening on port ${PORT}`))