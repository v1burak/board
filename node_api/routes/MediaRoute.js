var express = require('express');
var routes = express.Router();
var MediaController = require("../controllers/MediaController");

routes.route('/catalog').get(MediaController.getMedia);

module.exports = routes;