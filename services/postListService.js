const {
    errorHandler,
    errorPostCratorName,
    errorPostCratorMessages,
} = require('../shared/utilities/errorHandler');
const postModel = require('../models/post');

class PostListService {
    getPosts = async (data) => {
        const { cursor, limit, sort } = data;

        const posts = await postModel
            .find()
            .skip(cursor)
            .sort({ [sort.value]: sort.order })
            .limit(limit);

        return posts;
    };

    getPostsTotalCount = async () => {
        const postsTotalCount = await postModel.countDocuments();

        return postsTotalCount;
    };
}

module.exports = new PostListService();
