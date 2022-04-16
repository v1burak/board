var express = require('express');
var routes = express.Router();
var ImageController = require("../controllers/ImageController");

routes.route('/images').get(ImageController.getImages);

module.exports = routes;