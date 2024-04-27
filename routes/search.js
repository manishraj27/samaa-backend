const router = require("express").Router();
const { Song } = require("../models/song");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
	const search = req.query.search;
	if (search !== "") {
		const songs = await Song.find({
			name: { $regex: search, $options: "i" },
		}).limit(10);
		const result = { songs };
		res.status(200).send(result);
	} else {
		res.status(200).send({});
	}
});

module.exports = router;
