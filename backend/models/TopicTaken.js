const mongoose = require("mongoose");

const topicTakenSchema = new mongoose.Schema({
  date: { type: String, required: true },
  year: { type: String, required: true },
  department: { type: String, required: true },
  section: { type: String, required: true },

  facultyId: { type: String, required: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true }
});

module.exports = mongoose.model("TopicTaken", topicTakenSchema);
