require('dotenv').config()

const PORT = process.env.PORT
const NA_COOKIE = process.env.NA_COOKIE
const NA_TOKEN = process.env.NA_TOKEN
const EU_COOKIE = process.env.EU_COOKIE
const EU_TOKEN = process.env.EU_TOKEN

module.exports = {
  PORT,
  NA_COOKIE,
  NA_TOKEN,
  EU_COOKIE,
  EU_TOKEN,
}
