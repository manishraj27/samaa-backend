const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt"); 
const Joi = require("joi"); 
const tokenModel = require("../models/token"); // Renamed to avoid conflict with 'token' variable
const sendEmail = require("../utils/sendEmail"); // Import sendEmail function
const crypto = require("crypto"); // Import crypto module

// POST route for user login 
router.post("/", async (req, res) => {
	try {
		if (req.body.email && req.body.password) {
			const { error } = datavalidate(req.body);
			if (error)
				return res.status(400).send({ message: error.details[0].message });
			let user = await User.findOne({ email: req.body.email });
			
			if (!user)
				return res.status(400).send({ message: "Invalid Email or Password" });

		
			const validPassword = await bcrypt.compare(
				req.body.password,
				user.password
			);
			
			if (!validPassword)
				return res.status(401).send({ message: "Invalid Email or Password" });
			if(!user.verified){
				let verefToken = await tokenModel.findOne({userId:user._id}); // Changed to 'tokenModel' to avoid conflict
				if (!verefToken	){
					verefToken = await new tokenModel({
						userId: user._id,
						token: crypto.randomBytes(32).toString("hex"),
					}).save();
					const url = `
					Hey ${user.name}!,
					Welcome to Samaa Music Platform!
					Click on the link to verify your account at Samaa.
					Link: http://localhost:3001/users/${user.id}/verify/${verefToken.token}`; // Corrected variable name 'vrefToken' to 'verefToken'
					await sendEmail(user.email, "Verify your account", url); // Using sendEmail function

				}
				return res.status(400).send({ message: "An Email sent to your account please verify." });
			}

			const authToken = user.generateAuthToken(); // Renamed 'token' to 'authToken'
			
			return res.status(200).send({ data: user, authToken, message: "Logged in successfully" }); // Renamed 'token' to 'authToken'
		} else {
		
			return res.status(400).send({ message: "Email and password are required" });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
});

// Validate function for validating email and password
const datavalidate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;
