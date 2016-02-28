/**
 * Description: Users schema.
 * Version: v 0.0.1
 */

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var userSchema = new Schema(
		{
            username:   { type: String, required: true, unique: true },
            password:   { type: String, required: true },
            mapptoken:  String,
            status:     String
		},
        { collection : 'LDUSERS' });

userSchema.methods.generateHash = function(password) 
{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) 
{
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', userSchema);

module.exports = User;