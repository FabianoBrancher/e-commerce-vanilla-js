const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const authRouter = require('./routes/admin/auth');

const app = express();

// const bodyParser = (request, response, next) => {
//   if (request.method === 'POST') {
//     request.on('data', data => {
//       const parse = data.toString('utf8').split('&');
//       const formData = {};

//       for (let pair of parse) {
//         const [key, value] = pair.split('=');
//         formData[key] = value;
//       }
//       request.body = formData;
//       next();
//     });
//   } else {
//     next();
//   }
// }

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  keys: ['qwertypoiuasdfçlkj']
}))

app.use(authRouter);

app.listen('3333', () => {
  console.log('Listening on port 3333')
})