var express = require('express');
var routes = express.Router();
var VideoController = require("../controllers/VideoController");

routes.route('/videos').get(VideoController.getVideos);

module.exports = routes;