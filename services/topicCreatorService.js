const {
    errorHandler,
    errorTopicCreatorName,
    errorTopicCratorMessages,
} = require('../shared/utilities/errorHandler');
const topicModel = require('../models/topic');

class TopicCreator {
    createTopic = async (topics, session) => {
        try {
            const bulkOperations = [];

            if (topics.length === 0) {
                const topicExists = await topicModel.findOne({ name: 'Без темы' });

                if (!topicExists) {
                    bulkOperations.push({
                        insertOne: {
                            document: {
                                name: 'Без темы',
                                topicsSimilar: [],
                            },
                        },
                    });
                }
            }

            if (topics.length > 0) {
                for (const currentTopic of topics) {
                    const topicExists = await topicModel.findOne({ name: currentTopic });
                    let topicsSimilar = []; // [topicSimilar, topicSimilar, topicSimilar]

                    switch (true) {
                        case topicExists === null:
                            topicsSimilar = topics
                                .map((topicSimilar) => {
                                    return topicSimilar !== currentTopic
                                        ? { name: topicSimilar, count: 1 }
                                        : null;
                                })
                                .filter(Boolean);

                            bulkOperations.push({
                                insertOne: {
                                    document: {
                                        name: currentTopic,
                                        topicsSimilar: topicsSimilar,
                                    },
                                },
                            });
                            break;
                        case typeof topicExists === 'object' && topicExists !== null:
                            const topicSimilarExistsList = new Set(
                                topicExists.topicsSimilar.map((topicSibling) => topicSibling.name),
                            );

                            topicsSimilar = topics
                                .map((topicSimilar) => {
                                    return topicSimilar !== currentTopic
                                        ? { name: topicSimilar, count: 1 }
                                        : null;
                                })
                                .filter(Boolean)
                                .filter(
                                    (topicSibling) =>
                                        !topicSimilarExistsList.has(topicSibling.name),
                                );

                            bulkOperations.push({
                                updateOne: {
                                    filter: {
                                        name: currentTopic,
                                        'topicsSimilar.name': { $in: topics },
                                    },
                                    update: { $inc: { 'topicsSimilar.$[elem].count': 1 } },
                                    arrayFilters: [{ 'elem.name': { $in: topics } }],
                                },
                            });

                            if (topicsSimilar.length > 0) {
                                bulkOperations.push({
                                    updateOne: {
                                        filter: { name: currentTopic },
                                        update: {
                                            $addToSet: {
                                                topicsSimilar: { $each: topicsSimilar },
                                            },
                                        },
                                    },
                                });
                            }
                            break;

                        default:
                            break;
                    }
                }
            }

            if (bulkOperations.length > 0) {
                await topicModel.bulkWrite(bulkOperations, { session: session });
            }
        } catch (error) {
            console.log(error);
            throw errorHandler.errorRequest(
                errorTopicCreatorName.create,
                errorTopicCratorMessages.createFailed,
                [{ name: error.name, message: error.message, stack: error.stack }],
            );
        }
    };
}

module.exports = new TopicCreator();
