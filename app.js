const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
const Report = require('./models/Report');
const NotificationMiddleware = require('./middlewares/Notification');

const reportRouter = require('./routes/reports');
const verifyRouter = require('./routes/verify');

var app = express();

mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/corona`);

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

const sendNotification = schedule.scheduleJob(process.env.PUSH_SCHEDULE || '*/10 * * * * *', async() => {
  console.log('sendNotification');
  let currentDate = new Date();
  let ONE_HOUR = 60 * 60 * 1000;
  let newReports = await Report.find({reportDate: {$gte: currentDate - ONE_HOUR}});
  console.log(newReports.length);
  if(newReports > 0) {
    NotificationMiddleware.send();
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/reports', reportRouter);
app.use('/verify', verifyRouter);

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
  res.render('error');
});

module.exports = app;