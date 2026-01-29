
const mongoose = require('mongoose');
module.exports = mongoose.model('FacultyAttendance', new mongoose.Schema({facultyId:String,date:String,hour:Number,subject:String,status:String}));
