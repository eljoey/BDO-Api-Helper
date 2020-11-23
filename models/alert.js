const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const alertSchema = new Schema({
    itemId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    region: {
        type: String,
        enum: ['na', 'eu'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    direction: {
        type: String,
        enum: ['greater than or equal to', 'less than or equal to'],
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    lastAlert: Date,
});

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;