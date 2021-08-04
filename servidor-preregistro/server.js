const path = require('path');
const express = require('express');
const app = express();
const { check, validationResult, header } = require('express-validator');
var bodyParser = require('body-parser');
const axios = require('axios').default;

const HTTP_PORT = 8000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/events-list', function(req, res){
    axios.get(
        'https://gdlconnectory.pushbot.com/v1/webhooks/98d5273288296703df26ebeac385a22d03288ced6b8dc82468864289ba91686e?startRun=true',
        {
            headers: {
                "Authorization": "Token supersecrettoken"
            },
        }
    ).then((response)=>{
        events = response.data;
        res.send(events);
    });
});

app.get('/',(req,res)=>res.sendFile(path.resolve(__dirname, './index.html')));
app.use('/assets', express.static('assets'));
app.listen(HTTP_PORT, ()=> console.log(`HTTP server listening at ${HTTP_PORT}`));

//Http simple express app