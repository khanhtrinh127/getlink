var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

module.exports = function(passport){
    //sử dụng để đăng ký phiên sử dụng cho người dùng 
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    //sử dụng hủy phiên sử dụng của người dùng 
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        // usernameField: 'username',
        // passwordField: 'password',
        passReqToCallback: true 
    },
    function (req, username, password, done) {
        process.nextTick(function () {
            //kiểm tra xem username có tồn tại hay ko
            User.findOne({'local.username': username}, function (err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    //tạo mới user
                    var newUser = new User();
                    newUser.local.username = username;
                    newUser.local.password = newUser.generateHash(password);
                    //lưu user
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) { 
        User.findOne({'local.username': username}, function (err, user) {
            if (err)
                return done(err);           
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Wrong password.')); 
            return done(null, user);
        });
    })
    );
}
