const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

router.get('/all', async(req, res, next) => {
  console.log('GET /reports/all -> get all reports');
  let allReports = await Report.find();
  res.json(allReports);
});

router.post('/', async(req, res, next) => {
    console.log('POST /reports -> post new report');
    let body = req.body.report;
    let newReport = new Report({
        ...body,
        reportDate: new Date()
    });
    let response = await newReport.save();
    res.json(response);
})

module.exports = router;
