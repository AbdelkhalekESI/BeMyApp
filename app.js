var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect('mongodb://root:root00@ds227594.mlab.com:27594/bemyapp');
var EventScheema = new mongoose.Schema({
    name : String ,
    Benevols  : Number ,
    MaxBenevols : Number ,
    Lieu : String ,
    Date :  { type : Date , default : Date.now()} ,
    ListeBesoins : [String],
    EventsPictures : [String],
    MainPicture : String
}) ;
var Event = mongoose.model("Event" , EventScheema ) ;

Event.create({

} , () => console.log(""))

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

app.listen('3000' , () =>  console.log("server has started")) ;