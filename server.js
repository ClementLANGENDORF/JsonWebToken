import {dbConnect} from "./app/models/db";
import {ENV} from "./app/models/env";
import {createUser, findUsers, insertUser} from "./app/models/user";
import {run} from "./app/models/run";
import {check} from "express-validator/check/index";
import {authenticate} from "./app/models/authenticate";
import {routeMiddleware} from "./app/models/routeMiddleware";


// =======================
// get the packages we need ============
// =======================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongodb = require('mongodb');
var config = require('./config');


const start = () => {

// =======================
// configuration =========
// =======================
        var port = process.env.PORT || 8080;
        mongodb.connect(config.database);
        app.set('superSecret', config.secret);
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
        app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
        app.get('/', function (req, res) {
            res.send('Hello! The APy is at http://localhost:' + port + '/api');
        });


        app.get('/setup', function (req, res) {

            const clement = createUser("Clement", "1234", true);
            const antoine = createUser("Antoine", "bonjour", true);
            const toto = createUser("toto", "toto", true);
            insertUser(clement);
            insertUser(antoine);
            insertUser(toto);

            console.log('User saved successfully');
            return res.json({success: true});

        });

// API ROUTES

        // get an instance of the router for api routes
        var apiRoutes = express.Router();


        // route to authenticate a user (POST http://localhost:8080/api/authenticate)
        apiRoutes.post('/authenticate',
            [
                check('name').isLength({min: 2}).matches(/^.+/),
                check('password').isLength({min: 2}).matches(/^.+/),

            ],
            run(authenticate));
// route middleware
        apiRoutes.use(routeMiddleware);


        apiRoutes.get('/', function (req, res) {
            res.json({message: 'Welcome to the API !!'});
        });


//route to return all users

        apiRoutes.get('/user', run(findUsers));


        app.use('/api', apiRoutes);


// =======================
// start the server ======
// =======================
        app.listen(port);
        console.log('Magic happens at http://localhost:' + port);

    }
;

dbConnect().then(start);
