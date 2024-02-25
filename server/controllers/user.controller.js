// freecodecamp has this as /api/users.js

const router = require("express").Router();
const User = require("../models/user.model");
const requireValidation = require("../middleware/validate-session");

const serverError = (res, error) => {
  console.log("Server-side error");
  return res.status(500).json({
    Error: error.message,
  });
};

/* 
  Require in the bcrypt dependency by storing it in a variable.
  Bcrypt will be included in our controller --> add bcrypt in any file where we want encryption to take place.
*/
const bcrypt = require("bcrypt");
// Require in the jsonwebtoken dependency
const jwt = require("jsonwebtoken");
// Create a variable to hold the secret from our .env for the token
const SECRET = process.env.JWT;

router.post("/signup", async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  try {
    // Creating a new object based off the Model Schema.
    const user = new User({
      firstName: "",
      lastName: "",
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 13),
      role: req.body.role,
      course: req.body.course,
    }); // using values from req.body to form our object.

    const newUser = await user.save(); // Writes to database. Returns a response - why it should be an "await".

    // Create a token using the sign method of jwt, (payload, message, exp)
    // The payload should be the user ID, and secret message should eventually be in the .env
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1 day" });

    if (newUser) {
      console.log("newUser:", newUser, "token:", token);
    }
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.status(200).json({
      user: newUser,
      message: "Success! User Created!",
      token,
    });
  } catch (err) {
    res.status(500).json({
      ERROR: err.message,
    });
  }
});

/* 
----------------------------- Login Endpoint ------------------------
*/

router.post("/login", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log("connected to login")
  console.log('req.body',req.body)
  try {
    const { email, password } = req.body;
    console.log("email and password from req.body:",email, password)
    const user = await User.findOne({ email: email });
    console.log("user:",user)
    if (!user) throw new Error("Email or password does not match.");

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("passwordMatch",passwordMatch)
    if (!passwordMatch) throw new Error("Email or password does not match.");

    const token = jwt.sign({ id: user._id }, SECRET, {
      expiresIn: 60 * 60 * 24,
    });
    console.log("token", token);
    return res.status(200).json({
      message: "Login successful!",
      user,
      token,
    });
  } catch (err) {
    console.log("here's the catch")
    serverError(res, err);
  }
});

/* 
----------------------------- Find User Endpoint ------------------------
*/

router.get("/find", requireValidation, async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      try {
      const id = req.user._id;

      const findUser = await User.findOne({ _id: id });

      findUser
        ? res.status(200).json({
            message: "Found!",
            findUser,
          })
        : res.status(404).json({
            message: `No Users Found.`,
          });
    } catch (err) {
      serverError(res, err);
    }
})

/* 
----------------------------- Update Account Endpoint ------------------------
*/

// router.patch("/edit/", async (req, res) => {
router.patch("/edit", requireValidation, async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  try {
    // pull value from parameter (id)
    const id = req.user._id;
    const userFilter = {_id: id};

    // const { id } = req.params;
    const { firstName, lastName, email, password, role, course } = req.body;

    // if (req.body.password) {
    //   password = bcrypt.hashSync(req.body.password, 11);
      const info = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        // height: height,
        role: role,
        course: course,
      }
  
    // pull info from body

    // const userID = req.user._id;

    const returnOption = { new: true };

    //* findOneAndUpdate(query/filter, document, options)
    const updatedUser = await User.findOneAndUpdate(
      userFilter,
      info,
      returnOption
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: `User profile unable to be edited`,
      });
    }
    updatedUser
      ? res.status(200).json({
          message: `User profile updated!`,
          updatedUser,
        })
      : res.status(404).json({
          message: `User profile unable to be edited`,
        });
  } catch (err) {
    serverError(res, err);
  }
});

/* 
----------------------------- Delete Account Endpoint ------------------------
*/
router.delete("/delete", requireValidation, async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log("deleting...");
  try {
    //* Pull the user's info from the req
    const id = req.user._id;

    const userID = { _id: id };
    console.log("_id:", userID);
    const returnOption = { new: true };

    //* Remove user profile
    const deleteUser = await User.deleteOne(userID);

    deleteUser.deletedCount === 1
      ? res.status(200).json({
          message: `User account was successfully deleted!`,
          // message: `User account ${userName} was successfully deleted!`,
        })
      : res.status(404).json({
          message: `User data unable to be deleted.`,
        });
  } catch (err) {
    console.log("oops");
    serverError(res, err);
  }
});

module.exports = router;
