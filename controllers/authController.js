const authService = require('../services/authService');

class AuthController {
	logUp = async (req, res, next) => {
		try {
			const { body } = req;

			const user = await authService.logUp(body);

			res.cookie('refreshToken', user.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});

			delete user.refreshToken;

			res.json(user);
		} catch (error) {
			next(error);
		}
	};

	logIn = async (req, res, next) => {
		try {
			const { body } = req;

			const user = await authService.logIn(body);

			res.cookie('refreshToken', user.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});

			delete user.refreshToken;

			res.json(user);
		} catch (error) {
			next(error);
		}
	};

	refresh = async (req, res, next) => {
		try {
			const { refreshToken } = req.cookies;

			const refreshUser = await authService.refresh(refreshToken);
			res.cookie('refreshToken', refreshUser.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			delete refreshUser.refreshToken;

			res.json(refreshUser);
		} catch (error) {
			console.log(error);
			next(error);
		}
	};

	logOut = async (req, res, next) => {
		try {
			const { refreshToken } = req.cookies;
			await authService.logOut(refreshToken);
			res.clearCookie('refreshToken');

			res.json({ message: 'Пользователь вышел' });
		} catch (error) {
			next(error);
		}
	};
}

module.exports = new AuthController();
