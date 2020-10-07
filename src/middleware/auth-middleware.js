const jwt = require('jsonwebtoken');
const AnError = require('../error/AnError');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(AnError.notAuth('Tidak terotentikasi'));
    return;
  }
  const token = authHeader.split(' ')[1];
  let decodeToken;
  try {
    decodeToken = jwt.verify(token, 'codesecret');
  } catch (err) {
    next(AnError.internalError());
    return;
  }
  if (!decodeToken) {
    next(AnError.notAuth('Tidak terotentikasi'));
    return;
  }
  req.playerId = decodeToken.playerId;
  next();
};
