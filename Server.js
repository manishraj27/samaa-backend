const mongoose = require("mongoose")
mongoose.set('strictQuery', true);
const express = require("express");
const cors = require("cors");

const app = express();


const dburl = "mongodb://localhost:27017/sdpprojectsamaa14"
mongoose.connect(dburl).then(() => {
    console.log("Connected to DB Successfully")
}).catch((err) => {
    console.log(err.message)
});


app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/songs");
const playListRoutes = require("./routes/playLists");
const searchRoutes = require("./routes/search");


app.use("/api/users/", userRoutes);
app.use("/api/login/", authRoutes);
app.use("/api/songs/", songRoutes);
app.use("/api/playlists/", playListRoutes);
app.use("/api/", searchRoutes);

const port=3001
app.listen(port,()=>{
    console.log(`Server is running at port http://localhost:${port}`)
})