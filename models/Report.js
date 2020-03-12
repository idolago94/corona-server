const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
   coords: Object,
   from: Date,
   to: Date,
   reportDate: Date
});
const Report = mongoose.model('Reports', ReportSchema);


 module.exports = Report;
