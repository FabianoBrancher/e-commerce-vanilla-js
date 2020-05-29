const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

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

app.get('/signup', (request, response) => {
  return response.send(`
    <div>
    ${request.session.userId}
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>sign up</button>
      </form>
    </div>
  `)
});

app.post('/signup', async (request, response) => {
  const { email, password, passwordConfirmation } = request.body;

  const userExists = await usersRepo.getOneBy({ email });

  if (userExists) {
    return response.send('Email in use.');
  }

  if (password !== passwordConfirmation) {
    return response.send('Passwords must match.');
  }

  // Create a user in our user repo to represent this person

  const user = await usersRepo.create({ email, password });
  // Store the id of that user inside the users cookie
  request.session.userId = user.id //added by cookie session! (only exists because of cookie-session)

  return response.send('Account created!!!');
  // return response.send(`${email, password, passwordConfirmation}`);
});

app.get('/signout', (request, response) => {
  request.session = null;
  return response.send(`You're logged out`);
});

app.get('/signin', (request, response) => {
  response.send(`
  <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button>sign in</button>
      </form>
    </div>
  `);
});

app.post('/signin', async (request, response) => {
  const { email, password } = request.body;
  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return response.send('Wrong Email/Password');
  }

  const validPassword = await usersRepo.comparePasswords(user.password, password);

  if (!validPassword) {
    return response.send('Wrong Email/Password');
  }

  request.session.userId = user.id;

  return response.send('You are signed in')

});

app.listen('3333', () => {
  console.log('Listening on port 3333')
})