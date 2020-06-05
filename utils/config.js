require('dotenv').config()

let PORT = process.env.PORT
let BDO_COOKIE = process.env.BDO_COOKIE
let BDO_TOKEN = process.env.BDO_TOKEN

module.exports = {
    PORT,
    BDO_COOKIE,
    BDO_TOKEN
}