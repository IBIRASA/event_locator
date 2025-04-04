// const i18next = require('i18next');
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

// module.exports = i18next;
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");

i18next.use(Backend).init({
  fallbackLng: "en",
  backend: {
    loadPath: "./locales/{{lng}}/{{ns}}.json",
  },
  interpolation: {
    escapeValue: false,
  },
});

module.exports = i18next;
