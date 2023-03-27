const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../model/users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

userRouter.post("/register", async (req, res) => {
  const { email, pass, age } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      const user = new UserModel({ email, pass: hash, age });
      await user.save();
      res.status(200).send("Register has been done Successfull");
    });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(pass, user.pass, (err, result) => {
        if (result) {
          res.status(200).send({
            msg: "Login Successfull",
            token: jwt.sign({ userID: user._id }, "masai"),
          });
        } else {
          res.status(400).send({ msg: "Wrong Credential" });
        }
      });
    }
  } catch (err) {
    res.send({ msg: err.message });
  }
});

module.exports = {
  userRouter,
};
