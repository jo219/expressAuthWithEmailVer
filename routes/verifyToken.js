const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

// put to router.[get/post]('/', THIS_VERIFIER , (req, res) => {})
module.export = (req, res, next) => {
	const token = req.header('auth-token');
	if(!token) return res.this.status(401).send('Access Denied');

	try {
		const verified = jwt.verify(token, process.env.TOKEN_SECRET);
		req.user = verified; //provide user's id
		next();
	}catch(err) {
		res.status(400).send('Invalid Token');
	}
}