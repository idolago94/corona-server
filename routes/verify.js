const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/', async(req, res, next) => {
  console.log('POST /verify -> ', req.query.tel);
  console.log('code: ', req.body.code);
  let tel = req.query.tel;
  let code = req.body.code;
  let data = {
      to: `+${tel}`,
      from: 'CoronaApp',
      content: `Your corona app code: ${code}`
  }
  fetch('https://rest-api.d7networks.com/secure/send', {
      method: 'POST',
      headers: {'Authorization': 'Basic Ym9yaTM1OTY6N29NMVpsZ1M='},
      body: JSON.stringify(data)
  }).then(res => res.json()).then(response => {
      res.json(response);
  }).catch(err => console.log(err));  
});


module.exports = router;
