var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const express = require('express');
const app = express();
const cors = require('cors');


app.use(cors({
  origin: 'http://localhost:5173'// reemplaza esto con la URL de tu aplicación front-end
}));



let dotenv = require('dotenv');
dotenv.config();

let mongo = require('./config/dbconfig');
var indexRouter = require('./routes/index');
var productsRouter = require('./routes/products');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/', indexRouter);
app.use('/products', productsRouter);

app.get('/products/:imageName', function(req, res) {
  res.set('Content-Type', 'image/png');

  var imagePath = path.join(__dirname, 'public/images', req.params.imageName);
  var imageType;
  if (req.params.imageName.endsWith('.png')) {
    imageType = 'image/png';
  } else if (req.params.imageName.endsWith('.jpg') || req.params.imageName.endsWith('.jpeg')) {
    imageType = 'image/jpeg';
  } else if (req.params.imageName.endsWith('.gif')) {
    imageType = 'image/gif';
  }
  
  // Reemplazar barras invertidas con diagonales
  imagePath = imagePath.replace(/\\/g, '/');
  
  res.set('Content-Type', imageType);

  // Envía la imagen
  res.sendFile(imagePath, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
});



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
