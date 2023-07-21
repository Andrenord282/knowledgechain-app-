const topicSearchService = require('../services/topicSearchService');

class SearchController {
	search = async (req, res, next) => {
		try {
			switch (true) {
				case req.params.value === 'topics':
					const topics = await topicSearchService.searchTopics(req.query);
					res.json(topics);
					break;

				default:
					break;
			}
		} catch (error) {
			next(error);
		}
	};
}

module.exports = new SearchController();

