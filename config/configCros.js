const crosList = ['https://knowledgechain-app.vercel.app/', 'http://localhost:3000'];

const configCros = {
	origin: (origin, callback) => {
		if (crosList.includes(origin) || origin === undefined) {
			callback(null, true);
		} else {
			callback(new Error(`CORS не разрешеный origin: ${origin}`));
		}
	},
	optionsSuccessStatus: 200,
	credentials: true,
};

module.exports = configCros;
