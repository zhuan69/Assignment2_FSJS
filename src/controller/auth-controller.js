const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Player = require('../database/entity/player-schema');
const Resource = require('../database/entity/resource-schema');
const AnError = require('../error/AnError');

exports.indexUser = async (req, res) => {
  const users = await Player.find();
  res.status(200).json({
    message: 'Berhasil mengambil index data',
    users: users,
  });
};

exports.singup = async (req, res, next) => {
  const errValidation = validationResult(req);
  if (!errValidation.isEmpty()) {
    next(AnError.badRequest(errValidation.array()));
    return;
  }
  const { username, password, email } = req.body;
  const userDoc = await Player.findOne({ username: username });
  if (userDoc) {
    if (username === userDoc.username) {
      next(AnError.badRequest('Username sudah ada'));
      return;
    } else if (email === userDoc.email) {
      next(AnError.badRequest('Email sudah ada'));
      return;
    }
  }
  const createResource = new Resource({});
  createResource.save();
  const signupUser = new Player({
    username: username,
    password: password,
    email: email,
    resources: createResource._id,
  });
  const result = await signupUser.save();
  res.status(201).json({ message: 'Berhasil sign up', dataPlayer: result });
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  let loadUser;
  const user = await Player.findOne({ username: username });
  if (!user) {
    next(AnError.badRequest('Username atau password salah'));
    return;
  }
  loadUser = user;
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    next(AnError.badRequest('Username atau password salah'));
    return;
  }
  const token = jwt.sign(
    {
      username: loadUser.username,
      playerId: loadUser._id.toString(),
    },
    'codesecret',
    { expiresIn: '1h' },
  );
  res.status(200).json({
    message: 'Login oke',
    token: token,
    playerId: loadUser._id.toString(),
    username: loadUser.username,
  });
};
