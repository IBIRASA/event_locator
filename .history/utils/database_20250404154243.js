const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

module.exports = pool;// const i18next = require('i18next');
// const Backend = require('i18next-fs-backend');

// i18next
//     .use(Backend)
//     .init({
//         fallbackLng: 'en',
//         backend: {
//             loadPath: './locales/{{lng}}/{{ns}}.json',
//         },
//         interpolation: {
//             escapeValue: false,
//         },
//     });

