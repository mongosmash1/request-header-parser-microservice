'use strict';

const express = require('express');
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
    // left most IP is remote IP prior to the Glitch proxy
    let ipAddress = req.headers['x-forwarded-for'].split(',')[0];
    // left most languange is preferred language
    let language = req.headers['accept-language'].split(',')[0];
    // splits user-agent header on ( and ) and pulls OS from resulting array
    let operatingSystem = req.headers['user-agent'].split(/[\(\)]/)[1];

    res.json({ ipaddress: ipAddress, language: language, software: operatingSystem });
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

