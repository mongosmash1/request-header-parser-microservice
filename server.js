'use strict';

const express = require('express');
const os = require('os');
const app = express();
const port = process.env.PORT;

app.use('/public', express.static(process.cwd() + '/public'));

// serves static file by default containing instructions to use this microservice
app.route('/')
  .get(function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  })

// timestamp microservice
app.route('/api/whoami/')
  .get(function(req, res) {
    app.set('trust proxy', true);
    let ipAddress = req.ip;
    let language = req.headers['accept-language'].split(',');
    let softwareType = os.type();
    let softwareRelease = os.release();
    let softwarePlatform = os.platform();
    let softwareArch = os.arch()
    let software = softwareType + ' ' + softwarePlatform + ';' + softwarePlatform + ';' + softwareArch;
    
    res.json({ ipaddress: ipAddress, language: language[0], software: software });
  })

// respond not found for all invalid routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// error handling for middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});

