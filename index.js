const serialportgsm = require('serialport-gsm');
const express = require('express');

const modem = serialportgsm.Modem();
const app = express();

modem.open('COM', {logger: console});
const recipients = ['0043xxxxxxxxxx'];

app.get('/send', (req, res) => {
  for (const r of recipients) {
    modem.sendSMS(r, req.query.msg);
    res.send('success');
  }
});
app.listen(3000);