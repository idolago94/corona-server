const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

router.get('/all', async(req, res, next) => {
  console.log('GET /reports/all -> get all reports');
  let allReports = await Report.find;
  res.json(allReports);
});

router.post('/', async(req, res, next) => {
    console.log('POST /reports -> post new report');
    let body = req.body.report;
    body.map(report => report.reportDate = new Date());
    // let response = await newReport.save();
    Report.insertMany(body, (err, docs) => {
      if(err) {
        console.log(err);
      } else {
        res.json(docs);
      }
    })
    res.json(response);
})

module.exports = router;
