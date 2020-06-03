const express = require('express')
const config = require('./helpers/config')

const app = express()

//Routes
    // TODO: Change over all routes to post req and send info in body.
    // TODO: Implement Caching
const itemListRouter = require('./routes/itemList');
const itemInfoRouter = require('./routes/itemInfo');
const itemPricingRouter = require('./routes/itemPricing');
const itemSearchRouter = require('./routes/itemSearch');

app.use('/ItemList', itemListRouter)
app.use('/ItemInfo', itemInfoRouter)
app.use('/ItemPricing', itemPricingRouter)
app.use('/ItemSearch', itemSearchRouter)


const PORT = config.PORT || '3000'
app.listen(PORT, console.log(`Listening on port ${PORT}`))