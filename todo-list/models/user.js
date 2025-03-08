const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'User must have a name'],
        trim: true,
      },
    email: {
        type: String,
        require: [true, 'User must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']

    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        require: [true, 'Please provide a password'],
        minlength: 8,
        select: false // can't see the password field
    },
    passwordConfirm: {
        type: String, 
        require: [true, 'Please confirm your password'],
        validate: {
            // This is only works on create and SAVE!!
            validator: function(el) {
                return el === this.password;
            },
            message: 'Password are not the same'
        }
    },
});

userSchema.pre(/^find/, function(next){
    // this points to the current query
    this.find({active: {$ne: false }});
    next();
});

userSchema.pre('save',  async function(next){
    // only run this function if password was actually modified
    if(!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete the passwordConfirm field
    this.passwordConfirm = undefined;
    next();
}
); // works before saves the data to db

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
} 

const user = mongoose.model('User', userSchema);

module.exports = user;  
