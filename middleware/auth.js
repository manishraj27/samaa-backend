const jwt = require("jsonwebtoken");
dotenv = require("dotenv").config();

module.exports = (req, res, next) => {
	const token = req.header("x-auth-token");
	if (!token)
		return res
			.status(400)
			.send({ message: "Access denied, no token provided." });

	      jwt.verify(token, process.env.JWT_SECRET, (err, validToken) => {
		if (err) {
			return res.status(400).send({ message: "invalid token" });
		} else {
			req.user = validToken;
			next();
		}
	});
};
