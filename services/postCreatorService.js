const {
    errorHandler,
    errorPostCratorName,
    errorPostCratorMessages,
} = require('../shared/utilities/errorHandler');
const fileHanlder = require('../shared/utilities/fileHandler');
const postModel = require('../models/post');

class PostCreatorService {
    parser = (body) => {
        return JSON.parse(body.data);
    };

    createPost = async (params, schema, topics, files, session) => {
        try {
            if (files.length > 0) {
                const fileDataList = [];

                await fileHanlder.createFolder([
                    'posts',
                    `${params.authorName}-${params.postName}`,
                ]);

                for (const file of files) {
                    const fileData = await fileHanlder.createFile(
                        ['posts', `${params.authorName}-${params.postName}`],
                        file,
                    );
                    fileDataList.push(fileData);
                }

                for (const schemaKey in schema) {
                    const schemaItem = schema[schemaKey];

                    fileDataList.forEach((fileData) => {
                        if (fileData.fileName === schemaItem.id) {
                            schemaItem.value = fileData.fileSrc;
                        }
                    });
                }
            }

            await postModel.create(
                [
                    {
                        authorId: params.authorId,
                        authorName: params.authorName,
                        postId: params.postId,
                        postName: params.postName,
                        schema,
                        topics: topics.length > 0 ? topics : ['Без темы'],
                    },
                ],
                { session },
            );
        } catch (error) {
            console.log(error);
            throw errorHandler.errorRequest(
                errorPostCratorName.create,
                errorPostCratorMessages.createFailed,
                [{ name: error.name, message: error.message, stack: error.stack }],
            );
        }
    };
}

module.exports = new PostCreatorService();
