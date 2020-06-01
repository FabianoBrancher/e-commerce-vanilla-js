const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');

const router = express.Router();

const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireValidEmail,
  requireValidPasswordForUser,
} = require('./validators');

router.get('/signup', (request, response) => {
  return response.send(signupTemplate({ request }))
});

router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.send(signupTemplate({ request, errors }));
    }

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

router.post(
  '/signin',
  [requireValidEmail, requireValidPasswordForUser],
  async (request, response) => {
    const errors = validationResult(request);
    console.log(errors);

    const { email } = request.body;
    const user = await usersRepo.getOneBy({ email });

    request.session.userId = user.id;

    return response.send('You are signed in')

  });


module.exports = router;