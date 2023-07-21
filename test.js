import capitalizeFirstLetter from '../utilities/capitalizeFirstLetter.js';
import PostModel from '../models/Post.js';
import TopicModel from '../models/Topic.js';
import ErrorService from './errorService.js';

function randomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

class PostsService {
	parsingNewPost = (data) => {
		const test = data.dataNewPost;
		return JSON.parse(test);
	};

	createPost = async (data) => {
		try {
			const { idUser, author, postId, postName, postSchema, postThemes } = data;
			await PostModel.create({
				idUser,
				author,
				postId,
				postName,
				postSchema,
				postThemes,
				ratingCounter: randomInteger(10, 400),
				viewCounter: randomInteger(10, 400),
				commentsCounter: randomInteger(10, 400),
			});
		} catch (error) {
			throw ErrorService.ErrorServer('SendError', 'Не удалось создать пост');
		}
	};

	createPostTopics = async (data) => {
		const { postTopics } = data;

		if (postTopics.length > 0) {
			const topicList = postTopics.map((topic) => {
				return capitalizeFirstLetter(topic);
			});

			for (const topicName of topicList) {
				const existingTopic = await TopicModel.findOne({ name: topicName });
				const newSiblingTopics = topicList
					.map((topic) => (topic != topicName ? { name: topic, count: 1 } : null))
					.filter(Boolean);

				if (existingTopic) {
					await TopicModel.updateOne(
						{ name: topicName, 'siblingTopics.name': { $in: topicList } },
						{
							$inc: { 'siblingTopics.$[].count': 1 },
						},
					);
					await TopicModel.updateOne(
						{ name: topicName },
						{
							$addToSet: {
								siblingTopics: {
									$each: newSiblingTopics.filter((item) => {
										return !existingTopic.siblingTopics.some(
											(existingItem) => existingItem.name === item.name,
										);
									}),
								},
							},
						},
					);
				} else {
					await TopicModel.create({
						name: topicName,
						siblingTopics: newSiblingTopics,
					});
				}
			}
		}
	};

	getPostsList = async (options) => {
		try {
			const { typePostList } = options;
			if (typePostList === 'defaultPostList') {
				return await this.getDefaultPostList(options);
			}
			if (typePostList === 'viewedPostList') {
				return await this.getViewedPostListUser(options);
			}
		} catch (error) {
			console.log(error);
			// throw ErrorService.ErrorServer('SendError', 'Не удалось отправить посты');
		}
	};

	getDefaultPostList = async (options) => {
		const { idUser, limit, quantitySkipPost, sort, filters } = options;
		const paramsFind = this.setFilterPosts(filters);
		const quantityPost = await PostModel.countDocuments();

		const postListIsOver = () => {
			if (Number(quantitySkipPost) + Number(limit) > quantityPost) {
				return true;
			}
			return false;
		};

		const getQuantityViewedPostUser = async (idUser) => {
			return await UserActivityPostsJournal.findOne({ idUser: idUser }, { counterViewedPosts: 1 });
		};

		if (idUser !== undefined) {
			let cursor = 0;
			let postList = [];

			while (postList.length < Number(limit) && cursor <= quantityPost) {
				const postListDb = await PostModel.find(paramsFind)
					.skip(cursor)
					.sort({ [sort.value]: sort.order })
					.limit(limit);
				const filterViewedPosts = await this.filterViewedPosts(postListDb, idUser);
				postList.push(...filterViewedPosts);
				cursor = cursor + 10;
			}

			return {
				postList,
				postListIsOver: postListIsOver(),
				quantityViewedPost: await getQuantityViewedPostUser(idUser),
			};
		}

		const postListDb = await PostModel.find(paramsFind)
			.skip(quantitySkipPost)
			.sort({ [sort.value]: sort.order })
			.limit(limit);

		return { postList: [...postListDb], postListIsOver: postListIsOver() };
	};

	getViewedPostListUser = async (options) => {
		const { idUser, limit, quantitySkipPost, sort, filters, quantityViewedPost } = options;

		const postListIsOver = () => {
			if (Number(quantitySkipPost + limit) > quantityViewedPost) {
				return true;
			}
			return false;
		};
		const filterViewedPostListUser = { ...filters };
		const viewedPostListUser = await UserActivityPostsJournal.findOne({ idUser: idUser }, { viewedPosts: 1 });
		const viewedPostListUserRef = [];
		for (const postItem in viewedPostListUser.viewedPosts) {
			const viwedPost_id = viewedPostListUser.viewedPosts[postItem].ref;
			viewedPostListUserRef.push(viwedPost_id);
		}
		filterViewedPostListUser._id = viewedPostListUserRef;
		const paramsFind = this.setFilterPosts(filterViewedPostListUser);
		const postListDb = await PostModel.find(paramsFind)
			.skip(quantitySkipPost)
			.sort({ [sort.value]: sort.order })
			.limit(limit);
		return { postList: [...postListDb], postListIsOver: postListIsOver() };
	};

	filterViewedPosts = async (postListDb, idUser) => {
		const viewedPostList = await UserActivityPostsJournal.findOne({ idUser: idUser }, { viewedPosts: 1 });
		return postListDb.filter((post) => {
			return viewedPostList.viewedPosts[post._id] === undefined;
		});
	};

	setFilterPosts = (filters) => {
		if (filters === undefined) return {};
		const paramsFind = {};
		for (const filterName in filters) {
			switch (true) {
				case filterName === '_id':
					paramsFind._id = { $in: filters._id };
					break;
				case filterName === 'author':
					paramsFind.author = { $in: filters.author };
					break;
				case filterName === 'themesPost':
					paramsFind.themesPost = { $in: filters.themesPost };
					break;
				case filterName === 'ratingCounter':
					paramsFind.ratingCounter = { $gte: filters.ratingCounter };
					break;

				default:
					break;
			}
		}
		return paramsFind;
	};
}

export default new PostsService();