const { body } = require('express-validator');

exports.validatorRegister = () => {
  body('username').trim().isLength({ min: 3 }).notEmpty(),
    body('passwrod').trim().isLength({ min: 5 }),
    body('email')
      .isEmail()
      .withMessage({ message: 'Please insert valid email' });
};
