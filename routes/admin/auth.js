const express = require('express');
const { handleErrors } = require('./middlewares');
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
  handleErrors(signupTemplate),
  async (request, response) => {
    const { email, password } = request.body;
    const user = await usersRepo.create({ email, password });
    request.session.userId = user.id //added by cookie session! (only exists because of cookie-session)

    return response.redirect('/admin/products');
  });

router.get('/signout', (request, response) => {
  request.session = null;
  return response.send(`You're logged out`);
});

router.get('/signin', (request, response) => {
  response.send(signinTemplate({}));
});

router.post(
  '/signin',
  [requireValidEmail, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (request, response) => {
    const { email } = request.body;
    const user = await usersRepo.getOneBy({ email });
    request.session.userId = user.id;

    return response.redirect('/admin/products');
  });


module.exports = router;