const { default: mongoose } = require("mongoose");

const questionSchema = new mongoose.Schema({
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    question: { type: String, required: true },
    
    options: { type: [{
        option: { type: String, required: true },
        isCorrect: { type: Boolean, required: true }
    }], required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    createdAt: { type: Date, default: Date.now }
});
  
module.exports = mongoose.model("Question", questionSchema);
