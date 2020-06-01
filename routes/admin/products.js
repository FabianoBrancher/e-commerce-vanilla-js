const express = require('express');
const router = express.Router();
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');
const { validationResult } = require('express-validator');

router.get('/admin/products', (req, res) => {

});

router.get('/admin/products/new', (req, res) => {
  return res.send(productsNewTemplate({}));
});

router.post(
  '/admin/products/new',
  [requireTitle, requirePrice],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new Error('Error trying to create a new product.')
    }

    return res.send(productsNewTemplate({ errors, req }))
  });

module.exports = router;

