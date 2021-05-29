const bodyparser = require('body-parser');
const express = require('express');

const escolaresroute = require('./router/escolares.router')();

let app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.use('/escolares',escolaresroute);

module.exports = app;