//lấy ra các công cụ thư viện
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./config/database.js');

//kết nối db
mongoose.connect(configDB.url);
require('./config/passport')(passport);

app.use(morgan('dev')); //log tất cả request ra console log
app.use(cookieParser()); //đọc cookie (cần cho xác thực)
app.use(bodyParser()); //lấy thông tin từ html forms
app.set('view engine', 'ejs'); //cài đặt lấy ejs làm template

app.use(session({secret: 'ilovescodetheworld'})); 
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 

require('./app/routes.js')(app, passport); 

// app.get('/app1',function(req,res) {
//     res.send("Hello world From Server 1");
//     //res.redirect('http://localhost:3001');
// });
// app.listen(3001);

// app.get('/app2',function(req,res) {
//     res.send("Hello world From Server 2");
// });
// app.listen(3002);

app.listen(port);
console.log('Web appears on port ' + port);

