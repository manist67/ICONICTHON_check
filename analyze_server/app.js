const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const axios = require('axios');
axios.defaults.url = "http://localhost:5001";

const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload')

const app = express();

app.use(logger('dev'));
app.use(express.json({
  limit: "50mb"
}));
app.use(cors());
app.use(express.urlencoded({ 
  limit: "50mb",
  extended: false 
}));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/upload', uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message
  });
});

module.exports = app;
