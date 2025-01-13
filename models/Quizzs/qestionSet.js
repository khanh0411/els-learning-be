const { default: mongoose } = require("mongoose");

const questionSetSchema = new mongoose.Schema({
   course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Courses", required: true },
    name: { type: String, required: true },              
    easeQuestion: { type: Number, required: true },
    mediumQuestion: { type: Number, required: true },
    hardQuestion: { type: Number, required: true },       
    duration: { type: Number , required: true },                      
  }, { timestamps: true });
  
  module.exports = mongoose.model("QuestionSet", questionSetSchema);
  