const express = require('express');
const { body } = require('express-validator');
const authController = require('../controller/auth-controller');

const router = express.Router();

router.post('/', authController.login);
router.put(
  '/signup',
  [
    body('username')
      .trim()
      .isLength({ min: 3 })
      .withMessage({ message: 'Username harus 3 karakter atau lebih' })
      .notEmpty(),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage({ message: 'Password harus 5 karakter atau lebih' })
      .notEmpty(),
    body('email')
      .isEmail()
      .withMessage({ message: 'Masukan email sesuai format' })
      .normalizeEmail(),
  ],
  authController.singup,
);

module.exports = router;
