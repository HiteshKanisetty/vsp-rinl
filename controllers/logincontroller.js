const Login = require("../models/login.js");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Memo = require("../models/memo");
const { sendMail } = require("../util/mailer.js");
exports.getlogin = (req, res) => {
  res.render("login/login.ejs", {
    title: "Master Controller",
    message: "Welcome to the Master Controller!",
  });
};

exports.postlogin = (req, res) => {
  const empid = req.body.username;
  const password = req.body.password;
  Login.findOne({ empid: empid, password: password }).then((user) => {
    if (user) {
      res.render("master-dash/newmemo.ejs", {
        title: "Login Successful",
        message: "You have successfully logged in!",
        memo: {},
      });
    } else {
      res.render("login/login.ejs", {
        title: "Login Failed",
        message: "Invalid Employee ID or Password.",
      });
    }
  });
  console.log(`Employee ID: ${empid}, Password: ${password}`);
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await Login.findOne({ email });
  if (!user) return res.render("login/forgot", { message: "No user found." });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 24 * 3600000; // 1 hour
  await user.save();

  const resetLink = `http://localhost:2000/reset/${token}`;
  await sendMail(
    user.email,
    "Password Reset",
    `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
  );

  res.render("login/forgot", { message: "Check your email for reset link." });
};

exports.getReset = async (req, res) => {
  const user = await Login.findOne({
    resetToken: req.params.token,
    resetTokenExpires: { $gt: Date.now() },
  });
  if (!user) return res.send("Token expired or invalid.");
  res.render("login/reset", { token: req.params.token });
};

exports.postReset = async (req, res) => {
  const user = await Login.findOne({
    resetToken: req.params.token,
    resetTokenExpires: { $gt: Date.now() },
  });
  if (!user) return res.send("Token expired or invalid.");
  user.password = req.body.password; // hash in production!
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
};
