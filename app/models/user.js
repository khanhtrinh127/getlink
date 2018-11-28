var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//định nghĩa cấu trúc user model
var userSchema = mongoose.Schema({
    local: {    
        username: String,
        password: String
    },
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};
module.exports = mongoose.model('User', userSchema);