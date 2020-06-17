const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//DB CONFIG
mongoose.connect("mongodb://localhost:27017/devconnectorapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("we are connected!");
});

app.get("/", (req, res) => {
  res.json("Hello");
});

//USE ROUTES
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
  console.log("Server is up and running");
});
