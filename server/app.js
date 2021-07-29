let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cors = require('cors');
let bodyParser = require('body-parser');
//let cookieParser = require('cookie-parser');
let fileUpload = require('express-fileupload');
let session = require('express-session');
let secretKey = require('./config/jwt_secret');
const passport = require('passport');
const passportConfig = require('./middlewares/passport');



//let logger = require('morgan');

require('dotenv').config();
process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';

var testcaseRouter = require('./routes/testcase');

var admin_loginRouter = require('./routes/admin/login');
var admin_logoutRouter = require('./routes/admin/logout');
var admin_bookRouter = require('./routes/admin/book');
var admin_memberRouter = require('./routes/admin/member');

var admin_reviewRouter = require('./routes/admin/review');
var admin_purchaseRouter = require('./routes/admin/purchase');
var admin_favoriteAuthorRouter = require('./routes/admin/favorite_author');
var admin_favoriteBookRouter = require('./routes/admin/favorite_book');
var admin_categoryRouter = require('./routes/admin/category');
var admin_authorRouter = require('./routes/admin/author');

var api_authRouter = require('./routes/api/auth');
var api_bookRouter = require('./routes/api/book');
var api_memberRouter = require('./routes/api/member');
let api_favoriteAuthorRouter = require('./routes/api/favorite_author');
let api_favoriteBookRouter = require('./routes/api/favorite_book');
let api_purchaseRouter = require('./routes/api/purchase');
let api_cartRouter = require('./routes/api/cart');
let api_categoryRouter = require('./routes/api/category');
let api_authorRouter = require('./routes/api/author');
let api_reviewRouter = require('./routes/api/review');
let api_withdrawalRouter = require('./routes/api/withdrawal');
let api_notificationRouter = require('./routes/api/notification');
let api_payRouter = require('./routes/api/pay');

let app = express();

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_id',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 2400000
    }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('jwt-secret', secretKey);

app.use(cors());
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/testcase', testcaseRouter);

app.get('/api', (req, res) => {
    res.send('Hello JWT')
})

app.use('/admin/login', admin_loginRouter);
app.use('/admin/logout', admin_logoutRouter);

app.use('/admin/book', admin_bookRouter);

app.use('/admin/member', admin_memberRouter);
app.use('/admin/review', admin_reviewRouter);
app.use('/admin/purchase', admin_purchaseRouter);
app.use('/admin/favorite/author', admin_favoriteAuthorRouter);
app.use('/admin/favorite/book', admin_favoriteBookRouter);
app.use('/admin/category', admin_categoryRouter);
app.use('/admin/author', admin_authorRouter);

app.use('/api/auth', api_authRouter);
app.use('/api/book', api_bookRouter);

app.use('/api/member', api_memberRouter);
app.use('/api/favorite_author', api_favoriteAuthorRouter);
app.use('/api/favorite_book', api_favoriteBookRouter);
app.use('/api/purchase', api_purchaseRouter);
app.use('/api/cart', api_cartRouter);
app.use('/api/category', api_categoryRouter);
app.use('/api/author', api_authorRouter);
app.use('/api/review', api_reviewRouter);
app.use('/api/withdrawal', api_withdrawalRouter);
app.use('/api/notification', api_notificationRouter);
app.use('/api/pay',api_payRouter);
//app.use('/api/upload', api_uploadRouter);



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

app.use(passport.initialize());
passportConfig();
//console.log(passportConfig);

module.exports = app;
