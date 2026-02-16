const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, 'User must have a name'],
			minlength: [3, 'Name must be at least 3 characters'],
		},
		email: {
			type: String,
			required: [true, 'User must have an email'],
			unique: true,
			lowercase: true,
			validate: {
				validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
				message: 'Please provide a valid email address',
			},
		},
		photo: {
			type: String,
			default: 'https://example.com/default-user.png',
			validate: {
				validator: (value) => /^https?:\/\//.test(value),
				message: 'Photo must be a valid URL',
			},
		},
		role: {
			type: String,
			enum: ['user', 'guide', 'lead-guide', 'admin'],
			default: 'user',
		},
	 
		password: {
			type: String,
			required: [true, 'User must have a password'],
			minlength: [3, 'Password must be at least 8 characters'],
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, 'Please confirm your password'],
			validate: {
				validator: function (value) {
					return value === this.password;
				},
				message: 'Passwords do not match',
			},
		},
	},
	{ collection: 'users' }
);

userSchema.pre('save', async function () {
	if (!this.isModified('password')) return;

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userSchema);

module.exports = User;