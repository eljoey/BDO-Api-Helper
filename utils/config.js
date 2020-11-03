require('dotenv').config();

const PORT = process.env.PORT;
const NA_COOKIE = process.env.NA_COOKIE;
const NA_TOKEN = process.env.NA_TOKEN;
const EU_COOKIE = process.env.EU_COOKIE;
const EU_TOKEN = process.env.EU_TOKEN;
const BDO_STUFF_DB = process.env.MONGODB_URI;
const SECRET = process.env.SECRET;
const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const MAIN_URL = process.env.MAIN_URL;

module.exports = {
  PORT,
  NA_COOKIE,
  NA_TOKEN,
  EU_COOKIE,
  EU_TOKEN,
  BDO_STUFF_DB,
  SECRET,
  EMAIL,
  EMAIL_PASSWORD,
  MAIN_URL
};
