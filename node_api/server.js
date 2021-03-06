var express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path'),
	cors = require('cors');
let VideoRoute = require('./routes/VideoRoute');
let ConfigRoute = require('./routes/ConfigRoute');
let ImageRoute = require('./routes/ImageRoute');
let MediaRoute = require('./routes/MediaRoute');
let VideoController = require('./controllers/VideoController');
let MediaController = require('./controllers/MediaController');
let ConfigController = require('./controllers/ConfigController');
let ImageController = require('./controllers/ImageController');
var sockets = [];
const app = express();
var port = process.env.EXPRESS_PORT;
let configFilesImages = {
	fsRoot: path.resolve(__dirname, './images'),
	rootName: 'Images',
};
let configFilesCatalog = {
	fsRoot: path.resolve(__dirname, './media'),
	rootName: 'Media',
};
let configFilesVideos = {
	fsRoot: path.resolve(__dirname, './video'),
	rootName: 'Videos',
};

console.log(process.env.WEB_HOST, port);

let filemanager = require('@opuscapita/filemanager-server');

app.use((req, res, next) => {
	var _send = res.send;
	var sent = false;
	res.send = (data) => {
		if (sent) return;
		_send.bind(res)(data);
		sent = true;
	};
	next();
});

app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());

const server = app.listen(port, () => {
	console.log('Listening on port ' + port);
	console.log(new Date().toString());
	console.log(`SERVER STARTED...`);

	app.use('/api', VideoRoute);
	app.use('/api', ConfigRoute);
	app.use('/api', ImageRoute);
	app.use('/api', MediaRoute);
	app.use('/media', express.static(__dirname + '/images'));
	app.use('/catalog', express.static(__dirname + '/media'));
	app.use('/movies', express.static(__dirname + '/video'));
	app.use('/images', filemanager.middleware(configFilesImages));
	app.use('/videos', filemanager.middleware(configFilesVideos));
	app.use('/catalog', filemanager.middleware(configFilesCatalog));
	app.use(express.static(__dirname));
});
	
var http = require('http').Server(app);
var io = require('socket.io')(http);
var chokidar = require('chokidar');
let dir = "./video";
let config = "./config/config.json";
io.on('connection', (socket) => {
	console.log(`connected ${socket.id}`);
	sockets.push(socket.id);
	socket.on('disconnect', () => {
		console.log(`disconnected ${socket.id}`);
		if (sockets.indexOf(socket.id) > -1) {
			sockets.splice(sockets.indexOf(socket.id), 1);
		}
	});
	socket.on('refresh', function(data) {
		io.sockets.emit('refresh');
	})
});

var fileWatcher = () => {
	var watcher = chokidar.watch(dir, {});

	watcher.on('add', async function () {
			const videosJSON = await VideoController.getVideosFromDirectory();

			if (!videosJSON.error) {
				io.sockets.emit('videos', { videos: videosJSON.data });
			}
		})

	watcher.on('change', async function () {
		const videosJSON = await VideoController.getVideosFromDirectory();

		if (!videosJSON.error) {
			io.sockets.emit('videos', { videos: videosJSON.data });
		}
	})

	watcher.on('add', async function () {
		const mediaJSON = await MediaController.getMediaFromDirectory();

		if (!mediaJSON.error) {
			io.sockets.emit('media', { media: mediaJSON.data });
		}
	})

	watcher.on('change', async function () {
		const mediaJSON = await MediaController.getMediaFromDirectory();

		if (!mediaJSON.error) {
			io.sockets.emit('media', { media: mediaJSON.data });
		}
	})

	watcher.on('add', async function () {
		const imagesJSON = await ImageController.getImagesFromDirectory();

		if (!imagesJSON.error) {
			io.sockets.emit('images', { images: imagesJSON.data });
		}
	})

	watcher.on('change', async function () {
		const imagesJSON = await ImageController.getImagesFromDirectory();

		if (!imagesJSON.error) {
			io.sockets.emit('images', { images: imagesJSON.data });
		}
	})
};

var configWatcher = () => {
	var watcher = chokidar.watch(config, {});

	watcher.on('change', async function () {
		const configJSON = await ConfigController.readConfig();

		if (!configJSON.error) {
			io.sockets.emit('config', { config: configJSON.data });
		}
	});
}

setInterval(function(){
	io.sockets.emit('refresh');
}, 1000 * 60 * 60 * 24);

configWatcher();
fileWatcher();

http.listen(process.env.SOCKET_PORT, () => {
	console.log(`socket listening on :${process.env.SOCKET_PORT}`);
});