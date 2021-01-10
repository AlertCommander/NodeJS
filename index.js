const recipients = ['+436503552474'];
const tokens = ['abc123'];
const device = '/dev/ttyUSB0';
const escalation_levels = ["Emergency", "Alert", "Critical", "Error", "Warning", "Notice", "Informational", "Debug"];

const SerialPort = require("serialport");

const sp = new SerialPort(device);

const parser = new SerialPort.parsers.Readline();
sp.pipe(parser);


function sleep(ms){
return new Promise(resolve=>{
setTimeout(resolve,ms)
})
}

const express = require('express');
const app = express();

async function sendSMS(recipient, message) {
    await sleep(500);
    sp.write("ATZ\r");
    await sleep(500);
    sp.write('AT+CMGF=1\r')
    await sleep(500);
    sp.write(`AT+CMGS="${recipient}"\r`);
    await sleep(500);
    sp.write(`${message}\r`);
    await sleep(500);
    sp.write('\x1a');
    await sleep(500);
}



app.get('/send', async (req, res) => {
  try {
    msg = req.query.msg;
    token = req.query.token;
    level = req.query.level || 5;	
    msg = escalation_levels[level] + "! \n" + msg;
    if (!tokens.includes(token))
      return res.send('unauthorized');
    for (const r of recipients)
      await sendSMS(r, msg);
    return res.send('success');
  } catch (e) {
    return res.send('error');
  }
});
app.listen(3000, '0.0.0.0');
