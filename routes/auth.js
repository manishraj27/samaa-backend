const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt"); 
const Joi = require("joi"); 
const tokenModel = require("../models/token"); 
const sendEmail = require("../utils/sendEmail"); 
const crypto = require("crypto"); 

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
				let verefToken = await tokenModel.findOne({userId:user._id}); 
				if (!verefToken	){
					verefToken = await new tokenModel({
						userId: user._id,
						token: crypto.randomBytes(32).toString("hex"),
					}).save();
					const url = `
					Hey ${user.name}!,
					Welcome to Samaa Music Platform!
					Click on the link to verify your account at Samaa.
					Link: https://samavibes.vercel.app/users/${user.id}/verify/${verefToken.token}`; 
					await sendEmail(user.email, "Verify your account", url);

				}
				return res.status(400).send({ message: "An email already sent to your account. Please Verify to vibe with us. Check in Spams." });
			}

			const authToken = user.generateAuthToken(); 
			
			return res.status(200).send({ data: user, authToken, message: "Logged in successfully" }); 
		} else {
		
			return res.status(400).send({ message: "Email and password are required" });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
});

//GitHub: https://github.com/manishraj27

// Validate function for validating email and password
const datavalidate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;
