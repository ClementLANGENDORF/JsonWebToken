import {routeMiddleware} from "./routeMiddleware";
import {setupUser} from "./setupUser";
import {authenticate} from "./authenticate";
import {findUsers} from "./user";
import {check} from "express-validator/check/index";
import {run} from "./run";


export const Route = () => {

    // =======================
// routes ================
// =======================
// basic route
    app.get('/', function (req, res) {
        res.render('HelloWorld', { name: 'HelloWorld'});
    });


    app.get('/setup', setupUser);

// API ROUTES

// get an instance of the router for api routes
    let apiRoutes = express.Router();


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



};