
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/practice', {
  connectTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 30000,
});

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  desc: String,
  categories: {
    type: Array,
    default: []
  }
}, {
  timestamps: true,
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)