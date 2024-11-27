const express = require("express");
const User = require("../Model/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

const token = (id, name) => {
  return jwt.sign(
    {
      id,
      name
    },
    process.env.SECRET_STRING,
    { expiresIn: "20d" }
  );

};

router.post("/signup", (req, res) => {
  const user = User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  })
    .then(async (user) => {
        token(user._id, user.name)
        res.json({ user, token });
    })
    .catch((err) => res.json(err));
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    if (
     await user.comparePassword(
        password,
        user.password
      )
    ) {
      res.json({
        token: token(user._id, user.name),
        message: "user logged in",
      });
    } else {
      res.json("wrong password");
    }
  } else {
    res.json("user not found");
  }
});

module.exports = router;

// header
// payload
// signature

// signature= header , payload , secretstring
