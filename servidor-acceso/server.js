const path = require('path');
const express = require('express');
const app = express();
const fs = require("fs");
const https = require("https");
const key = fs.readFileSync("localhost-key.pem", "utf-8");
const cert = fs.readFileSync("localhost.pem", "utf-8");
const { check, validationResult, header } = require('express-validator');
var bodyParser = require('body-parser');
const axios = require('axios').default;
const mongoose = require('mongoose');
const User = require("./user.js")
var events;
var passport = require('passport');
require("./passport")(passport);
const {ensureAuthenticated} = require("./auth.js")

mongoose.connect('mongodb://localhost/db',{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('connected,,'))
.catch((err)=> console.log(err));





var session = require("express-session"),
    bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const HTTP_PORT = 3001;



app.get('/login',(req,res)=>{
    res.sendFile(path.resolve(__dirname, './login-form/index.html'))
})
app.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true,
        })(req,res,next);
  })

//logout
app.get('/logout',(req,res)=>{
 })

app.use(passport.initialize());
app.use(passport.session());

app.get('/', ensureAuthenticated, (req,res)=>res.sendFile(path.resolve(__dirname, './index.html')));
app.get('/escanear/', ensureAuthenticated,(req,res)=>res.sendFile(path.resolve(__dirname, './escanear/index.html')));
app.get('/registro/', ensureAuthenticated,(req,res)=>res.sendFile(path.resolve(__dirname, './registro/index.html')));
app.get('/eventos/', ensureAuthenticated,(req,res)=>res.sendFile(path.resolve(__dirname, './eventos/index.html')));
app.use('/assets', express.static('assets'));

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

app.post( '/add-event', [
        check('nombre').notEmpty().withMessage("No puedes dejar el nombre vacío."),
        check('inicioVal').notEmpty().withMessage("No puedes dejar la fecha  de inicio vacía"),
        check('finalVal').notEmpty().withMessage("No puedes dejar la fecha  de cierre vacía"),
        check('inicio').isISO8601().withMessage("Fecha de inicio inválida"),
        check('final').isISO8601().withMessage("Fecha de término inválida"),
    ],
    function(req,res){
        //Validate info
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        } else {
            //webhook de workflow "Eventos actuales"
            axios.post(
                'https://gdlconnectory.pushbot.com/v1/webhooks/848a58c8983805d482b51ef37d558aee71f285a3c941c33aa2d1441e9a0b09f9',
                {
                    "nombre": req.body.nombre,
                    "inicio": req.body.inicio,
                    "final": req.body.final
                },
                {
                    headers: {
                        "Authorization": "Token supersecrettoken"
                    },
                }
            );
            res.send({});
        }
    }
);

app.post('/update-events', [
        check('a_partir_de_').isISO8601().withMessage("Fecha inválida"),
    ],
    function(req,res){
        const errors = validationResult(req);
        console.log(req.body);
        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        } else {
            //webhook de workflow "Filtrar eventos pasados"
            axios.post(
                'https://gdlconnectory.pushbot.com/v1/webhooks/59f2ff1c3fe72d4082193f73d1cfd47b7993537e798b4359a7f4da40d7afb48c',
                {
                    "a-partir-de": req.body.a_partir_de_
                },
                {
                    headers: {
                        "Authorization": "Token supersecrettoken"
                    },
                }
            );
            res.send({});
        }
    }    
);

app.post( '/add-visitor', [
    check('nombre').notEmpty().withMessage("No puedes dejar el nombre vacío."),
    check('n-mero-de-tel-fono').notEmpty().withMessage("No puedes dejar el teléfono vacío"),
    check('correo-electr-nico').isEmail().withMessage("Valor de correo inválido"),
    check('evento').custom(value => {
        if(events[value] != null){
            return true;
        }else{
            throw new Error("Valor de evento inválido");
        }
    }).withMessage("Valor de evento inválido"),
    check('temperatura').isDecimal().withMessage("Valor de temperatura inválida"),
],
function(req,res){
    //Validate info
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    } else {
        //webhook de workflow "Eventos actuales"
        axios.post(
            'https://gdlconnectory.pushbot.com/v1/webhooks/1b02ef136cda8a77adbff974547a9ae88c06e38550d84f82b90b13b225cf5939',
            {
                "nombre": req.body.nombre,
                "inicio": req.body.inicio,
                "final": req.body.final
            },
            {
                headers: {
                    "Authorization": "Token supersecrettoken"
                },
            }
        );
        res.send({});
    }
}
);

app.listen(HTTP_PORT, ()=>{
    console.log(`Server listening on ${HTTP_PORT}`);
});

//HTTPS is required by chrome to grant camera permission
//localhost.pem and localhost-key.pem are the certificates required by https
//Both were made using the mkcert tool

//https.createServer({ key, cert }, app).listen(3001);

console.log("Running");