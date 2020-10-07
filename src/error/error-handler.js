const AnError = require('./AnError');
exports.errorHandler = function (err, req, res, next) {
  if (err instanceof AnError) {
    res.status(err.code).json({ success: false, message: err.message });
    return;
  }
  res.status(500).json({ message: 'Something went wrong!' });
};
