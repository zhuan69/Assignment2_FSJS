//Import modules
const express = require('express');
const authRoute = require('./routes/auth-routes');
const mongoose = require('mongoose');
const playerRoute = require('./routes/player-routes');
const { errorHandler } = require('./error/error-handler');
//Modules variables
require('dotenv').config();
const app = express();

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(authRoute);
app.use('/player', playerRoute);

app.use(errorHandler);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
