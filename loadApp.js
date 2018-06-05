import {run} from "./app/models/run";
import {Route} from "./app/models";

export const loadApp = () => {

// =======================
// configuration =========
// =======================
    let express = require('express');
    let app = express();
    let bodyParser = require('body-parser');
    let morgan = require('morgan');
    let mongodb = require('mongodb');
    let config = require('./config');
    let port = process.env.PORT || 8080;
    let https = require('https');
    let fs = require('fs');
    let options = {
        key: fs.readFileSync('./certificatSSL/ca.key', 'utf8'),
        cert: fs.readFileSync('././certificatSSL/ca.crt', 'utf8')
    };


    mongodb.connect(config.database);
    app.set('superSecret', config.secret);
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(morgan('dev'));

    run(Route);

// =======================
// start the server ======
// =======================
    //app.listen(8080);
    https.createServer(options, app).listen(port);
    console.log('Magic happens at https://localhost:' + port);

};