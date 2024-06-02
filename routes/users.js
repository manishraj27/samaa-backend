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
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });
    
        const user = await User.findOne({ email: req.body.email });
        if (user)
            return res
                .status(403)
                .send({ message: "User with given email already exists!" });
    
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
        
        const url = `https://samavibes.vercel.app/users/${newUser.id}/verify/${vrefToken.token}`;
        
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Samaa Music Platform</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 10px 0;
                }
                .header img {
                    width: 100px;
                }
                .content {
                    padding: 20px;
                    line-height: 1.6;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 20px 0;
                    color: #ffffff;
                    background-color: #007BFF;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    font-size: 12px;
                    color: #666666;
                }
                @media (max-width: 600px) {
                    .container {
                        width: 100%;
                        padding: 10px;
                    }
                    .button {
                        width: 100%;
                        text-align: center;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://via.placeholder.com/100" alt="Samaa Music Platform">
                </div>
                <div class="content">
                    <h1>Hey ${newUser.name}!</h1>
                    <p>Welcome to Samaa Music Platform!</p>
                    <p>Click the button below to verify your account at Samaa:</p>
                    <p>
                        <a href="${url}" class="button">Verify Your Account</a>
                    </p>
                    <p>If the button above does not work, copy and paste the following link into your browser:</p>
                    <p><a href="${url}">${url}</a></p>
                    <p>Visit my Portfolio at: <a href="https://manishraj.me">https://manishraj.me</a></p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Samaa Music Platform. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        await sendEmail(newUser.email, "Verify your account", htmlContent);
    
        res 
            .status(201)
            .send({ message: "An email sent to your account. Please verify to vibe with us. Check in Spam." });
    
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
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
