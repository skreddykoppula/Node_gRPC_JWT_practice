const mongoose = require('mongoose')
const { isEmail } = require('validator');

const userSchema =  new mongoose.Schema({
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Minimum password length is 6 characters'],
    }
  });

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email})
    if(user){
        if(user.password === password){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email')
}


const user = mongoose.model('User',userSchema)

module.exports = user;