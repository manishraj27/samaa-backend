const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

const tokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "user",
		unique: true,
	},
	token: { type: String, required: true },
	createdAt: 
	{ 
		type: String,
		default: () => moment().tz('Asia/Kolkata').format(), //'DD-MM-YYYY HH:mm:ss A' inside format if you want 
		expires: 3600 
	},
});

module.exports = mongoose.model("token", tokenSchema);