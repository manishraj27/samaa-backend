const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt"); // for password hashing
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Token = require("../models/token");

// create user
router.post("/", async (req, res) => {
	try{
		const { error } = validate(req.body);
		if (error) return res.status(400).send({ message: error.details[0].message });
	
		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(403)
				.send({ message: "User with given email already Exist!" });
	
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(req.body.password, salt);
		let newUser = await new User({
			...req.body,
			password: hashPassword,
		}).save();
	
		const vrefToken = await new Token({
			userId: newUser._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();
		const url = `
		Hey ${newUser.name}!,
		Welcome to Samaa Music Platform!
		Click on the link to verify your account at Samaa.
		Link: http://localhost:3000/users/${newUser.id}/verify/${vrefToken.token}`;
		await sendEmail(newUser.email, "Verify your account", url);
	
		res 
			.status(201)
			.send({ message: "An email sent to your account please verify"});
	
	} catch (error) {
	console.log(error);
	res.status(500).send({ message: "Internal server error" });
	// newUser.password = undefined;
	// newUser.__v = undefined;
	// res
	// 	.status(200)
	// 	.send({ data: newUser, message: "Account created successfully" });
	}
});

// verify email
router.get("/:id/verify/:token", async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const vreftoken = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!vreftoken) return res.status(400).send({ message: "Invalid link" });

		await User.updateOne({ _id: user._id }, { verified: true }); // Corrected update operation
		await vreftoken.remove();

		res.status(200).send({ message: "Email verified successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});



// get all users
router.get("/", admin, async (req, res) => {
	const users = await User.find().select("-password -__v");
	res.status(200).send({ data: users });
});

// get user by id
router.get("/:id", [validateObjectId, auth], async (req, res) => {
	const user = await User.findById(req.params.id).select("-password -__v");
	res.status(200).send({ data: user });
});

// update user by id
router.put("/:id", [validateObjectId, auth], async (req, res) => {
	const user = await User.findByIdAndUpdate(
		req.params.id,
		{ $set: req.body },
		{ new: true }
	).select("-password -__v");
	res.status(200).send({ data: user, message: "Profile updated successfully" });
});

// delete user by id
router.delete("/:id", [validateObjectId, admin], async (req, res) => {
	await User.findByIdAndDelete(req.params.id);
	res.status(200).send({ message: "Successfully deleted user." });
});



module.exports = router;
