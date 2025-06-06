const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const loginroutes = require("./routes/loginroutes");
const masterroutes = require("./routes/masterroutes");
const cors = require("cors"); // allow all origins for testing

const app = express();
const MONGODB_URI =
  "mongodb+srv://hiteshkanisetty:Hitu9866@cluster1.cguepfd.mongodb.net/vsp?retryWrites=true&w=majority&appName=cluster1";
const port = 2000;
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "styles")));
app.use(express.static(path.join(__dirname, "js")));
app.use(cors());
app.use(express.json());
app.use(loginroutes);
app.use(masterroutes);
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(port, "0.0.0.0");
    console.log("Server started");
  })
  .catch((err) => console.log("err"));
