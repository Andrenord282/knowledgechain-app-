import crosList from "../utilities/crosList.js";

const credentials = (req, res, next) => {
	const origin = req.headers.origin;
	if (crosList.includes(origin)) {
		res.header('Access-Control-Allow-Credentials', true);
	}
	next();
};

export default credentials;
