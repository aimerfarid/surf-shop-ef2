const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  image: String,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

/*
##User##
- email - string
- password - string
- username - string
- profilePic - string
- posts - array of objects ref Post
- reviews - array of objects ref Review
*/
