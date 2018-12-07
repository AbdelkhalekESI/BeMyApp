var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();
var port = process.env.PORT || 3000 ;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect('mongodb://root:root00@ds227594.mlab.com:27594/bemyapp' , { useNewUrlParser: true } );
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

var UserScheema = new mongoose.Schema({
    first_name : String ,
    last_name  : String ,
    EventLists : [EventScheema]
}) ;
var User = mongoose.model("User" , UserScheema ) ;


app.get("/" , function (req,res) {
Event.find({} , function (err , Events) {
    if(err) throw err ;
    else res.send(Events) ;
})
})

app.post("/newUser" , function (req,res) {
    // username + userid + event id
    Event.findById(req.query.eventId , function (err, foundedEvent) {
        if(err) throw err ;
        else {
            foundedEvent.Benevols++ ;
            foundedEvent.save();
            User.findById(req.query.userId , function (err ,  foundedUser) {
                if(err) throw err ;
                else {
                    foundedUser.EventLists.push(foundedEvent);
                    foundedUser.save();
                }
            })
        }
    })
    res.send("Done ! ") ;
})

app.post("/newEvent " , function (req,res) {
    Event.create({
    name : req.query.name ,
        Benevols  : 0,
        MaxBenevols : req.query.benevols ,
        Lieu : req.query.lieu,
        ListeBesoins : ["Item1" , "Item2"],
        EventsPictures : ["URL1" , "URL2"],
        MainPicture : "URL"
    } , () => console.log(""))


})

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

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

app.listen(port , () =>  console.log("server has started")) ;