const {
    errorHandler,
    setErrorLog,
    errorAuthMessages,
    errorAuthName,
    errorAuthLog,
} = require('../shared/utilities/errorHandler');
const { encryptPassword, checkPassword } = require('../shared/utilities/passwordHandler');
const userModel = require('../models/user');
const getUserDto = require('../dto/getUserDto');
const jwtServices = require('../services/jwtService');

class AuthServices {
    logUp = async (body) => {
        const { userEmail, userName, userPassword } = body;
        const userEmailExists = await userModel.findOne({ userEmail });
        const userNameExists = await userModel.findOne({ userName });

        if (userEmailExists || userNameExists) {
            const errorLog = setErrorLog(
                {
                    ['userEmailExists']: userEmailExists,
                    ['userNameExists']: userNameExists,
                },
                errorAuthLog,
            );
            throw errorHandler.errorRequest(
                errorAuthName.logUp,
                errorAuthMessages.logUpFailed,
                errorLog,
            );
        }

        const hachingPassword = await encryptPassword(userPassword);
        const user = await userModel.create({
            userEmail,
            userName,
            passwordHashed: hachingPassword,
        });

        const userDto = getUserDto(user);
        const tokens = jwtServices.generateJWT({ ...userDto });
        await jwtServices.saveRefreshJWT(userDto.userId, tokens.refreshToken);
        return { ...userDto, ...tokens };
    };

    logIn = async (body) => {
        const { userName, userPassword } = body;

        const user = await userModel.findOne({ userName });
        if (!user) {
            const errorLog = setErrorLog(
                {
                    ['userNameNotFound']: true,
                },
                errorAuthLog,
            );

            throw errorHandler.errorRequest(
                errorAuthName.logIn,
                errorAuthMessages.logInFailed,
                errorLog,
            );
        }

        const password = await checkPassword(userPassword, user.passwordHashed);
        if (!password) {
            const errorLog = setErrorLog(
                {
                    ['userNameNotMatch']: true,
                    ['userPasswordNotMatch']: true,
                },
                errorAuthLog,
            );

            throw errorHandler.errorRequest(
                errorAuthName.logIn,
                errorAuthMessages.logInFailed,
                errorLog,
            );
        }

        const userDto = getUserDto(user);
        const tokens = jwtServices.generateJWT({ ...userDto });
        await jwtServices.saveRefreshJWT(userDto.userId, tokens.refreshToken);

        return { ...userDto, ...tokens };
    };

    logOut = async (refreshToken) => {
        await jwtServices.removeToken(refreshToken);
    };

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw errorHandler.errorRequest(
                'Error refreshToken',
                errorAuthMessages.refreshTokenNotExists,
                401,
            );
        }
        
        const userData = jwtServices.validateRefreshToken(refreshToken);
        const token = await jwtServices.searchToken(refreshToken);

        if (!userData || !token) {
            throw errorHandler.errorRequest(
                'Error refreshToken',
                errorAuthMessages.updateRefreshTokenFailed,
            );
        }

        const user = await userModel.findById(userData.userId);
        const userDto = getUserDto(user);
        const tokens = jwtServices.generateJWT({ ...userDto });
        await jwtServices.saveRefreshJWT(userDto.userId, tokens.refreshToken);

        return { ...userDto, ...tokens };
    }
}

module.exports = new AuthServices();
