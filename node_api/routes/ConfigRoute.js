var express = require('express');
var routes = express.Router();
var ConfigController = require("../controllers/ConfigController");

routes.route('/config').get(ConfigController.getConfig);
routes.route('/config/auth').get(ConfigController.auth);
routes.route('/config').post(ConfigController.changeConfig);
routes.route('/config/timer').get(ConfigController.getTimerConfig);
routes.route('/config/timer').post(ConfigController.changeTimer);

module.exports = routes;