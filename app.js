const express = require('express')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

const app = express()

//Routes
// TODO: Change over all routes to post req and send info in body.
// TODO: Implement Caching
// TODO: Sort Ingredients into groups and add ability to grab prices for groups
// TODO: Learn how to make queries work
const itemListRouter = require('./routes/itemList')
const itemInfoRouter = require('./routes/itemInfo')
const itemPricingRouter = require('./routes/itemPricing')
const itemSearchRouter = require('./routes/itemSearch')
const cookMatPricesRouter = require('./routes/cookMatPrices')
const alchMatPricesRouter = require('./routes/alchMatPrices')

app.use('/ItemList', itemListRouter)
app.use('/ItemInfo', itemInfoRouter)
app.use('/ItemPricing', itemPricingRouter)
app.use('/ItemSearch', itemSearchRouter)
app.use('/CookMatPrices', middleware.cache(300), cookMatPricesRouter)
app.use('/AlchMatPrices', middleware.cache(300), alchMatPricesRouter)

const PORT = config.PORT || '3000'
app.listen(PORT, console.log(`Listening on port ${PORT}`))
