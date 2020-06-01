const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .custom(async email => {
      const userExists = await usersRepo.getOneBy({ email });

      if (userExists) {
        throw new Error('Email in use.');
      }
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 }),
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .custom((passwordConfirmation, { request }) => {
      if (passwordConfirmation !== request.body.password) {
        throw new Error('Passwords must match');
      }
    }),
  requireValidEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async email => {
      const user = await usersRepo.getOneBy({ email });

      if (!user) {
        throw new Error('Email not found');
      }
    }),
  requireValidPasswordForUser: check('password')
    .trim()
    .custom(async (password, { req }) => {
      const { email } = req.body;
      const user = await usersRepo.getOneBy({ email });

      if (!user) {
        throw new Error('Invalid password');
      }

      const validPassword = await usersRepo.comparePasswords(user.password, password);

      if (!validPassword) {
        throw new Error('Invalid Password');
      }
    })
}