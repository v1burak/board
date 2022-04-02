var express = require('express'),
	bodyParser = require('body-parser'),
	cors = require('cors');
let VideoRoute = require('./routes/VideoRoute');
let ConfigRoute = require('./routes/ConfigRoute');
let VideoController = require('./controllers/VideoController');
let ConfigController = require('./controllers/ConfigController');
var sockets = [];
const app = express();
var port = process.env.EXPRESS_PORT;
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
	app.use(express.static(__dirname));
});
	
var http = require('http').Server(app);
var io = require('socket.io')(http);
var chokidar = require('chokidar');
let dir = "./video";
let config = "./config/config.json";
let path = `${process.env.EXPRESS_SCHEME}${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}/data/activeVideoes/`;
io.on('connection', (socket) => {
	console.log(`connected ${socket.id}`);
	sockets.push(socket.id);
	socket.on('disconnect', () => {
		console.log(`disconnected ${socket.id}`);
		if (sockets.indexOf(socket.id) > -1) {
			sockets.splice(sockets.indexOf(socket.id), 1);
		}
	});
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

setInterval( async function(){ 
    var hour = new Date().getHours();
	var timer = await ConfigController.getTimer();

    if (hour >= timer.startTime && hour < timer.offTime) {
        io.sockets.emit('cron', { enabled: true });
    } else {
		io.sockets.emit('cron', { enabled: false });
	}
} , 1000*60);

configWatcher();
fileWatcher();

http.listen(process.env.SOCKET_PORT, () => {
	console.log(`socket listening on :${process.env.SOCKET_PORT}`);
});