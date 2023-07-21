const { Schema, model } = require('mongoose');

const topicSchema = new Schema({
	name: {
		type: String,
		require: true,
	},
	topicsSimilar: [
		{
			name: { type: String, required: true },
			count: { type: Number, required: true },
		},
	],
});

module.exports = model('Topic', topicSchema);
