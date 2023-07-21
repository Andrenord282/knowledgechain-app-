const bcrypt = require('bcrypt');

const saltRounds = 10;

encryptPassword = async (password) => {
	return await bcrypt.hash(password, saltRounds);
};

checkPassword = async (reqPassword, passwordHashed) => {
	return await bcrypt.compare(reqPassword, passwordHashed);
};

module.exports = {
	encryptPassword,
	checkPassword,
};
