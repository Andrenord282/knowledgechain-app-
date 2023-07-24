const mongoose = require('mongoose');
const postCreatorService = require('../services/postCreatorService');
const postListService = require('../services/postListService');
const topicCreatorService = require('../services/topicCreatorService');

class PostController {
    createPost = async (req, res, next) => {
        let session = null;

        try {
            session = await mongoose.startSession();
            session.startTransaction();
            const { body, files } = req;
            const { params, schema, topics } = postCreatorService.parser(body);

            await topicCreatorService.createTopic(topics, session);
            await postCreatorService.createPost(params, schema, topics, files, session);

            await session.commitTransaction();

            res.status(200).send('Пост создан');
        } catch (error) {
            await session.abortTransaction();
            next(error);
        } finally {
            session.endSession();
        }
    };

    getPosts = async (req, res, next) => {
        try {
            const posts = await postListService.getPosts(req.query);
            res.json(posts);
        } catch (error) {
            next(error);
        }
    };

    getPostsTotalCount = async (req, res, next) => {
        try {
            const postsTotalCount = await postListService.getPostsTotalCount();
            res.json(postsTotalCount);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PostController();
