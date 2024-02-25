const mongoose = require("mongoose");

const QuestionsSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true,
    }, 
    question: {
        type: Object,
        required: true,
    },
    answer: {
        type: Object,
        required: true,
    },
    category: {
        type: Object,
        required: true,
    },
    unit: {
        type: Object,
        required: true,
    },
});

module.exports = mongoose.model("Questions", QuestionsSchema);

// Change added from "https://www.freecodecamp.org/news/deploying-a-mern-application-using-mongodb-atlas-to-heroku"
// module.exports = mongoose.model("Food", FoodSchema, "foods");
