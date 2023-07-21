const { ErrorHandler } = require('../shared/utilities/errorHandler');

const errorMiddleware = (err, req, res, next) => {
	if (err instanceof ErrorHandler) {
		return res.status(err.status).json({ errorName: err.name, message: err.message, errorLogList: err.errorLogList });
	}
	return res.status(500).json({ err: err.message, message: 'Непредвиденная ошибка' });
};

module.exports = errorMiddleware;
