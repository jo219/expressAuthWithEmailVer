const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 6,
		max: 255,
	},
	email: {
		type: String,
		required: true,
		min: 6,
		max: 255,		
	},
	password: {
		type: String,
		required: true,
		min: 6,
		max: 1024,
	},
	date: {
		type: Date,
		default: Date.now
	},
	active: {
        type: Boolean,
        default: false
    },
    activeToken: String,
    activeExpires: Date,
});

module.exports = mongoose.model('User', userSchema);