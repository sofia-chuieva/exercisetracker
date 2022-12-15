const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
mongoose.set("strictQuery", true);

const db = mongoose.createConnection(process.env.MONGO_URI);

db.on("error", console.error.bind(console, "MongoDB Connection Error>> : "));
db.once("open", function () {
  console.log("client MongoDB Connection ok!");
});

let db2 = db.useDb("freeCodeCamp");

let userSchema = new mongoose.Schema({
  username: { type: String },
});

let User = db2.model("User", userSchema);

app.post("/api/users", (req, res) => {
  try {
    const newUser = new User({ username: req.body.username });
    newUser.save();
    res.status(200).json({
      _id: newUser._id,
      username: newUser.username,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

const listener = app.listen(process.env.PORT || 8111, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
