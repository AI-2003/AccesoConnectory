const path = require('path');
const express = require('express');
const app = express();
const fs = require("fs");
const https = require("https");
const key = fs.readFileSync("localhost-key.pem", "utf-8");
const cert = fs.readFileSync("localhost.pem", "utf-8");


app.get('/',(req,res)=>res.sendFile(path.resolve(__dirname, './index.html')));
app.use('/assets', express.static('assets'))
https.createServer({ key, cert }, app).listen(2003);

console.log("Running");

//HTTPS server option