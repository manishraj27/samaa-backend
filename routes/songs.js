const router = require("express").Router();
const { User } = require("../models/user");
const { Song, validate } = require("../models/song");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

//GitHub: https://github.com/manishraj27

// Create song
router.post("/", admin, async (req, res) => {
    try {
        const { error } = validate(req.body); 
        if (error) return res.status(400).send({ message: error.details[0].message });

        const song = await new Song(req.body).save(); 
        res.status(201).send({ data: song, message: "Song created successfully" });
    } catch (error) {
        console.error("Error creating song:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// Get all songs
router.get("/", async (req, res) => {
	const songs = await Song.find();
	res.status(200).send({ data: songs });
});

// Update song
router.put("/:id", [validateObjectId, admin], async (req, res) => {
	const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.send({ data: song, message: "Updated song successfully" });
});

// Delete song by ID
router.delete("/:id", [validateObjectId, admin], async (req, res) => {
	await Song.findByIdAndDelete(req.params.id);
	res.status(200).send({ message: "Song deleted sucessfully" });
});

// Get song by ID
router.get("/:id",[validateObjectId, auth], async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).send({ message: "Song not found" });

        res.status(200).send({ data: song });
    } catch (error) {
        console.error("Error fetching song:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Like song
router.put("/like/:id", [validateObjectId, auth], async (req, res) => {
	let resMessage = "";
	const song = await Song.findById(req.params.id);
	if (!song) return res.status(400).send({ message: "song does not exist" });

	const user = await User.findById(req.user._id);
	const index = user.likedSongs.indexOf(song._id);
	if (index === -1) {
		user.likedSongs.push(song._id);
		resMessage = "Added to your liked songs";
	} else {
		user.likedSongs.splice(index, 1);
		resMessage = "Removed from your liked songs";
	}

	await user.save();
	res.status(200).send({ message: resMessage });
});

// Get liked songs by user ID
router.get("/like/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        const songs = await Song.find({ _id: { $in: user.likedSongs } });

        res.status(200).send({ data: songs });
    } catch (error) {
        console.error("Error fetching liked songs:", error);
        res.status(500).send({ message: "Internal server error." });
    }
});


module.exports = router;
