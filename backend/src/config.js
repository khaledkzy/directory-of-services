const dotenv = require('dotenv')

dotenv.config()

const {
  DATABASE_URL,
  NODE_ENV,
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  SITE_HOST,
  SITE_EMAIL
} = process.env


export {
  DATABASE_URL,
  NODE_ENV,
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  SITE_HOST,
  SITE_EMAIL
}
