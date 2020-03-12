const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
   coords: Object,
   from: Date,
   to: Date,
   reportDate: Date
}, {
   writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
});
const Report = mongoose.model('Reports', ReportSchema);


 module.exports = Report;
