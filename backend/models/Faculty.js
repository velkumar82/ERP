
const mongoose = require('mongoose');
module.exports = mongoose.model('Faculty', new mongoose.Schema({facultyId:String,name:String,department:String}));
