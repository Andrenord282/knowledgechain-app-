const { Schema, model } = require('mongoose');

const userSchema = new Schema(
	{
		userName: {
			type: String,
			require: true,
			unique: true,
		},
		passwordHashed: {
			type: String,
			require: true,
		},
		userEmail: {
			type: String,
			require: true,
			lowercase: true,
			unique: true,
		},
		userImgUrl: {
			type: String,
			default: 'https://clck.ru/3366Y2',
		},
	},
	{
		timestamps: true,
	},
);

module.exports = model('User', userSchema);
