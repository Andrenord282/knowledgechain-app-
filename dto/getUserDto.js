const getUserDto = (model) => {
	return {
		userId: model._id,
		userName: model.userName,
		userEmail: model.userEmail,
		userImgUrl: model.userImgUrl,
	};
};

module.exports = getUserDto;
