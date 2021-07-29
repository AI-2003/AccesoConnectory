const path = require('path');
const express = require('express');
const app = express();
const fs = require("fs");
const https = require("https");
const key = fs.readFileSync("localhost-key.pem", "utf-8");
const cert = fs.readFileSync("localhost.pem", "utf-8");

const HTTP_PORT = 8000;


//Retrieves html files to the designated path
app.get('/',(req,res)=>res.sendFile(path.resolve(__dirname, './index.html')));
app.get('/escanear/',(req,res)=>res.sendFile(path.resolve(__dirname, './escanear/index.html')));
app.get('/registro/',(req,res)=>res.sendFile(path.resolve(__dirname, './registro/index.html')));
app.get('/eventos/',(req,res)=>res.sendFile(path.resolve(__dirname, './eventos/index.html')));
app.use('/assets', express.static('assets'))

//HTTPS is required by chrome to grant camera permission
//localhost.pem and localhost-key.pem are the certificates required by https
//Both were made using the mkcert tool

https.createServer({ key, cert }, app).listen(3001);

console.log("Running");