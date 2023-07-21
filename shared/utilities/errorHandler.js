class ErrorHandler extends Error {
    constructor(status, name, message, errorLogList = []) {
        super(message);
        this.status = status;
        this.name = name;
        this.errorLogList = errorLogList;
    }

    errorRequest(name, message, errorLogList = [], ) {
        return new ErrorHandler(400, name, message, errorLogList);
    }

    errorServer(name, message) {
        return new ErrorHandler(500, name, message);
    }
}

const errorAuthName = {
    logUp: 'Error LigUp',
    logIn: 'Error logIn',
};

const errorAuthMessages = {
    logUpFailed: 'Не удалось зарегестрировать пользователя',
    logInFailed: 'Не удалось войти в учетную запись',
    refreshTokenNotExists: 'Рефреш токен не найден',
    updateRefreshTokenFailed: 'Рефрештокен не прошел валидацию или токен не найден',
};

const errorAuthLog = {
    userNameExists: {
        name: 'userName',
        message: 'Пользователь с таким именем уже существует',
    },
    userEmailExists: {
        name: 'userEmail',
        message: 'Пользователь с такой почтой уже существует',
    },
    userNameNotFound: {
        name: 'userName',
        message: 'Пользователь не найден',
    },
    userNameNotMatch: {
        name: 'userName',
        message: 'Неверный логин или пароль',
    },
    userPasswordNotMatch: {
        name: 'userPassword',
        message: 'Неверный логин или пароль',
    },
};

const errorPostCratorName = {
    create: 'Error postCreator',
};

const errorPostCratorMessages = {
    createFailed: 'Не удалось создать пост',
};

const errorTopicCreatorName = {
    create: 'Error topicCreator',
};

const errorTopicCratorMessages = {
    createFailed: 'Не удалось записать темы поста',
};

const setErrorLog = (errorNames, errorLogList) => {
    const errors = Object.keys(errorNames)
        .filter((name) => errorNames[name])
        .reduce((acc, name) => {
            acc[name] = errorLogList[name];
            return acc;
        }, {});

    return errors;
};

module.exports = {
    ErrorHandler: ErrorHandler,
    errorHandler: new ErrorHandler(),
    setErrorLog,
    errorAuthName,
    errorAuthMessages,
    errorAuthLog,
    errorPostCratorName,
    errorPostCratorMessages,
    errorTopicCreatorName,
    errorTopicCratorMessages,
};
