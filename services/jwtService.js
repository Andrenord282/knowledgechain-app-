const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token');

class JwtServices {
	generateJWT = (data) => {
		const accessToken = jwt.sign(data, process.env.ACCESS_JWT_SECRET, {
			expiresIn: '1d',
		});
		const refreshToken = jwt.sign(data, process.env.REFRESH_JWT_SECRET, {
			expiresIn: '30d',
		});

		return {
			accessToken,
			refreshToken,
		};
	};

	validateRefreshToken(refreshToken) {
		const userData = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);

		return userData;
	}

	searchToken = async (refreshToken) => {
		const tokenData = await tokenModel.findOne({ refreshToken });

		return tokenData;
	};

	saveRefreshJWT = async (idUser, refreshToken) => {
		const tokenData = await tokenModel.findOne({ user: idUser });

		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return tokenData.save();
		}

		await tokenModel.create({
			user: idUser,
			refreshToken,
		});
	};

	removeToken = async (refreshToken) => {
		await tokenModel.deleteOne({ refreshToken });
	};
}

module.exports = new JwtServices();
