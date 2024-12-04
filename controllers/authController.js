const User = require("../Model/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const setToken = (id, name) => {
    return jwt.sign(
      {
        id,
        name
      },
      process.env.SECRET_STRING,
      { expiresIn: "20d" }
    );
  
  };

exports.getUsers = (req ,res) =>{
    const users = User.find({})
    .then(users => res.send(users))
    .catch(err => console.log(err))
}

exports.signUp = (req, res) => {
    const user = User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    })
      .then(async (user) => {
          const token = setToken(user._id, user.name)
          console.log(token)
          res.json({ user, token });
      })
      .catch((err) => res.json(err));
  }

exports.logIn = async (req, res) => {
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
          token: setToken(user._id, user.name),
          message: "user logged in",
        });
      } else {
        res.json("wrong password");
      }
    } else {
      res.json("user not found");
    }
  }

  exports.protect = (req,res,next) =>{
    let token 
    const testToken = req.headers.authorization

    if(testToken && testToken.toLowerCase().startsWith("bearer") ){
      token = testToken.split(" ")[1]
      try {
        jwt.verify(token,process.env.SECRET_STRING)
      } catch (error) {
        console.log(error)
      }
    }
    else{
        res.status(401).send("your are not logged in")
    }
    next()
  }