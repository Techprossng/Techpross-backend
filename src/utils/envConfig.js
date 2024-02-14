// @ts-check
require("dotenv").config();

const envConfigVars = {
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT ?? '465',
    MAIL_ID: process.env.MAIL_ID,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    REMITA_MERCHANT_ID: process.env.REMITA_MERCHANT_ID,
    REMITA_API_KEY: process.env.REMITA_API_KEY,
    REMITA_LIVE_URL: process.env.REMITA_LIVE_URL,
    REMITA_DEMO_URL: process.env.REMITA_DEMO_URL,
    AMQP_URL: process.env.AMQP_URL ?? "",
    ENV: process.env.NODE_ENV
}

module.exports = envConfigVars;