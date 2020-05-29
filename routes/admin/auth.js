const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');

const router = express.Router();

const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');


router.get('/signup', (request, response) => {
  return response.send(signupTemplate({ request }))
});

router.post('/signup',
  [
    check('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .custom(async email => {
        const userExists = await usersRepo.getOneBy({ email });

        if (userExists) {
          throw new Error('Email in use.');
        }
      }),
    check('password')
      .trim()
      .isLength({ min: 4, max: 20 }),
    check('passwordConfirmation')
      .trim()
      .isLength({ min: 4, max: 20 }).custom((passwordConfirmation, { request }) => {
        if (passwordConfirmation !== request.body.password) {
          throw new Error('Passwords must match');
        }
      }),
  ], async (request, response) => {
    const errors = validationResult(request);


    const { email, password, passwordConfirmation } = request.body;

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