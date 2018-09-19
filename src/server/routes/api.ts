import {Router} from 'express';
import * as bodyParser from 'body-parser';
import {Config} from '../models/config';


module.exports = (APP_CONFIG: Config) => {
    const router = Router();
    const logger = APP_CONFIG.logger;

    // PUBLIC
    router.use(bodyParser.json({limit: '100mb'}));
    router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


    // Return middleware router
    return router;
}
