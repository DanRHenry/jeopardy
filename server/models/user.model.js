const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model("User", UserSchema);

// Change added from "https://www.freecodecamp.org/news/deploying-a-mern-application-using-mongodb-atlas-to-heroku"
// module.exports = mongoose.model("User", UserSchema, "users");