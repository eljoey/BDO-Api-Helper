const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    passwordHash: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        uniquecaseInsensitive: true
    },
    alerts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alert' }],
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

mondule.exports = User;