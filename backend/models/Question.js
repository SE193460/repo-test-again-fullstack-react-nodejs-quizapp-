const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    text: String,
    options: [String],
    correct: Number
});

module.exports = mongoose.model("Question", questionSchema);