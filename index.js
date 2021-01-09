const recipients = ['+436503552474'];
const tokens = ['abc123'];
const device = '/dev/ttyUSB0';

const serialportgsm = require('serialport-gsm');
const express = require('express');

const modem = serialportgsm.Modem();
const app = express();

modem.open(device, { logger: console });

app.get('/send', (req, res) => {
  try {
    msg = req.query.msg;
    token = req.query.token;
    if (!tokens.includes(token))
      return res.send('unauthorized');
    for (const r of recipients)
      modem.sendSMS(r, msg);
    return res.send('success');
  } catch (e) {
    return res.send('error');
  }
});
app.listen(3000, '0.0.0.0');
