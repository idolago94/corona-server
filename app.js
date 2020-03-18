const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
const fetch = require('node-fetch');

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

var sendNotification = schedule.scheduleJob(process.env.PUSH_SCHEDULE, function(){
  console.log('sendNotification');
  let bodyRequest = {
    "request": {
      "application": "4E22D-DBF89", // Pushwoosh application code
      "auth": "q0d5z9n6GwgI3XaUdwhpxM2poyk700pq1Nxw0DfGMCCLbMHX7dxgadKRDjNDjhUid7RcY45RTBCqClYHH5w1", // API access token from Pushwoosh Control Panel
      "notifications": [
        {
          // Content settings 
          "send_date": "now",  // required. YYYY-MM-DD HH:mm OR 'now'
          "ignore_user_timezone": true, // or false, required
          "content": {  // required, object( language1: 'content1', language2: 'content2' ) OR string. Ignored for Windows 8, use "wns_content" instead. (Use \n for multiline text. Ex: "hello\nfriend")
            "en": process.env.PUSH_MESSAGE
          },
        }
      ]
    }
  }
  fetch(`https://cp.pushwoosh.com/json/1.3/createMessage`,{
    method: 'POST',
    body: JSON.stringify(bodyRequest)
  }).then(res => res.json()).then(response => console.log('Sendd notification response: ', response));
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