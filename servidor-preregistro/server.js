const path = require('path');
const express = require('express');
const app = express();

const HTTP_PORT = 8000;

app.get('/',(req,res)=>res.sendFile(path.resolve(__dirname, './index.html')));
app.use('/assets', express.static('assets'));
app.listen(HTTP_PORT, ()=> console.log(`HTTP server listening at ${HTTP_PORT}`));

//Http simple express app