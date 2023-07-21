const { Schema, model } = require('mongoose');

const postSchema = new Schema(
    {
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
        postId: {
            type: String,
            required: true,
            unique: true,
        },
        postName: {
            type: String,
            required: true,
            unique: true,
        },
        schema: {
            type: Array,
            required: true,
        },
        topics: {
            type: Array,
            default: [],
        },
        ratingCounter: {
            type: Number,
            default: 0,
        },
        viewCounter: {
            type: Number,
            default: 0,
        },
        commentsCounter: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = model('Post', postSchema);
