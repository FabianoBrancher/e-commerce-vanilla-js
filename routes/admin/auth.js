const express = require('express');
const usersRepo = require('../../repositories/users');

const router = express.Router();

const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');


router.get('/signup', (request, response) => {
  return response.send(signupTemplate({ request }))
});

router.post('/signup', async (request, response) => {
  const { email, password, passwordConfirmation } = request.body;

  const userExists = await usersRepo.getOneBy({ email });

  if (userExists) {
    return response.send('Email in use.');
  }

  if (password !== passwordConfirmation) {
    return response.send('Passwords must match.');
  }

  const user = await usersRepo.create({ email, password });
  request.session.userId = user.id //added by cookie session! (only exists because of cookie-session)

  return response.send('Account created!!!');

});

router.get('/signout', (request, response) => {
  request.session = null;
  return response.send(`You're logged out`);
});

router.get('/signin', (request, response) => {
  response.send(signinTemplate());
});

router.post('/signin', async (request, response) => {
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


module.exports = router;