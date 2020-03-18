const fetch = require('node-fetch');

const send = () => {
    let bodyRequest = {
        "request": {
          "application": "4E22D-DBF89", // Pushwoosh application code
          "auth": "q0d5z9n6GwgI3XaUdwhpxM2poyk700pq1Nxw0DfGMCCLbMHX7dxgadKRDjNDjhUid7RcY45RTBCqClYHH5w1", // API access token from Pushwoosh Control Panel
          "notifications": [
            {
              // Content settings 
              "send_date": "now",  // required. YYYY-MM-DD HH:mm OR 'now'
              "ignore_user_timezone": true, // or false, required
              "content": {  // required, object( language1: 'content1', language2: 'content2' ) OR string. Ignored for Windows 8, use "wns_content" instead. (Use \n for multiline text. Ex: "hello\nfriend")
                "en": process.env.PUSH_MESSAGE || 'There are new reports.'
              },
            }
          ]
        }
    }
    fetch(`https://cp.pushwoosh.com/json/1.3/createMessage`,{
        method: 'POST',
        body: JSON.stringify(bodyRequest)
    }).then(res => res.json()).then(response => console.log('Send notification response: ', response));
}

module.exports = {
    send: send
}