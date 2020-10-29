const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const alertSchema = new Schema({
    itemId: Number,
    price: Number,
    direction: {
        type: String,
        enum: ['greater than or equal to', 'less than or equal to'],
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    active: {
        type: Boolean,
        default: true
    },
    lastAlert: Date,
});

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;