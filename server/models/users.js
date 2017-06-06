const mongoose = require('mongoose');
const crypt = require('../services/crypt');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        validate: {
            validator: username => User.findOne({ username }).then(user => !user),
            message: 'User already exists'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'The password must be at least {MINLENGTH} characters length.'],
        maxlength: [30, 'The password can not have more than {MAXLENGTH} characters.']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, 'Email address is required'],
        validate: {
            validator: email => User.findOne({ email }).then(user => !user),
            message: 'Email is already in use'
        },
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }
});

UserSchema.pre('save', function (next) {
    const user = this;
    crypt.hash(user.password).then((hash) => {
        user.password = hash;
        next();
    }).catch(next);
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
