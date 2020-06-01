const express = require('express')
const mongoose = require('mongoose')

const app = express()

//Routes
    // TODO: Change over all routes to post req and send info in body.
const itemListRouter = require('./routes/itemList');
const itemInfoRouter = require('./routes/itemInfo');
const itemPricingRouter = require('./routes/itemPricing');

app.use('/ItemList', itemListRouter)
app.use('/ItemInfo', itemInfoRouter)
app.use('/ItemPricing', itemPricingRouter)


const PORT = process.env.PORT || '3000'
app.listen(PORT, console.log(`Listening on port ${PORT}`))