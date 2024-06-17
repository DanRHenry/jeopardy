const mongoose = require("mongoose");

const GameplaySchema = new mongoose.Schema({
    question: {
        type: Object,
        required: true
    },
    answer: {
        type: Object,
        required: true
    },
    category: {
        type: Object,
        required: true
    },
    gameName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("GameplayInformation", GameplaySchema);
