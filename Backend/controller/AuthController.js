// Authentication, Login and Register User
const  User = require('../models/users.js');
const  jwt = require('jsonwebtoken');
const  bcrypt = require('bcrypt');
const { generateVerificationToken, emailUserRegistrationConfirmationMessage } = require('../middleware/emailUser.js');


const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password', err);
      return res.status(500).json({
        error: err,
      });
    } else {
      const verifyTokenData = generateVerificationToken();

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        verificationToken: verifyTokenData.verificationToken,
        verificationTokenExpires: verifyTokenData.expiresIn,
        isVerified: false
      });
      
      user
        .save()
        .then((result) => {
          emailUserRegistrationConfirmationMessage(req.body.email, req.body.name, verifyTokenData.verificationToken);
          // Here, you can exclude the password field from the response using select('-password') in the query
          User.findById(result._id).select('-password')
            .then(user => {
              res.status(201).json({
                message: "User created successfully, Please check your email to verify your account.",
                user: user
              });
            })
            .catch(err => {
              console.error("Error fetching user data:", err);
              res.status(500).json({
                message: "Error fetching user data",
                error: err
              });
            });
        })
        .catch((err) => {
          console.error("Error saving user to database:", err);
          res.status(500).json({
            message: "Error creating user",
            error: err,
          });
        });
    }
  });
};



const login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ $or: [{ email: email }, { username: email }] })
    .then((user) => {
      if (!user) {
        return res.status(403).json({
          message: "User not found, please sign up",
        });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Authentication failed",
            error: err,
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_TOKEN,
            {
              expiresIn: "36h",
            }
          );
          return res.status(200).json({
            message: "Authentication successful",
            token: token,
            userId: user._id
          });
        } else {
          res.status(401).json({
            message: "Authentication failed! Please try again",
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "An error occurred",
        error: err,
      });
    });
};

const logout = async (req, res, next) => {
  try {
    // Clear the JWT cooki
    await res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error logging out",
      error: err,
    });
  }
};


module.exports = {
  register: register,
  login: login,
  logout: logout
};
