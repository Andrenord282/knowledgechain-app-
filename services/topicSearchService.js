const topicModel = require('../models/topic');

class TopicSearchService {
	searchTopics = async (data) => {
		const { topicName } = data;

		const topics = await topicModel.find({ name: { $regex: new RegExp(topicName, 'i') } });
		if (topics.length === 0) {
			return [
				{
					_id: topicName,
					name: topicName,
					topicsSimilar: [],
				},
			];
		}
		return topics;
	};
}

module.exports = new TopicSearchService();
