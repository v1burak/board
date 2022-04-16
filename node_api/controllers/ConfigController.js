const fs = require('fs');

const CONFIG_PATH = './config/config.json';
const TIMER_PATH = './config/time.json';
const AUTH_PATH = './config/auth.json';

module.exports.readConfig = () => {
    return new Promise((resolve, reject) => {
        try {
			let config = fs.readFileSync(CONFIG_PATH);

			resolve({ error: false, data: JSON.parse(config) });
			return;
		} catch (_catch) {
			resolve({ error: true, data: _catch, message: _catch.message });
			return;
		}
    })
};

module.exports.getConfig = async (req, res, next) => {
    let config = fs.readFileSync(CONFIG_PATH);
    res.send(JSON.parse(config));
};

module.exports.getConfig = async (req, res, next) => {
    let config = fs.readFileSync(CONFIG_PATH);
    res.send(JSON.parse(config));
};

module.exports.getTimer = () => {
    return new Promise((resolve, reject) => {
        try {
			let timer = fs.readFileSync(TIMER_PATH);

			resolve({ error: false, data: JSON.parse(timer) });
			return;
		} catch (_catch) {
			resolve({ error: true, data: _catch, message: _catch.message });
			return;
		}
    })
};

module.exports.auth = async (req, res, next) => {
    let configAuth = fs.readFileSync(AUTH_PATH);
    res.send(JSON.parse(configAuth));
};

module.exports.changeTimer = async (req, res, next) => {
    const timer = req.body;

    fs.readFile(TIMER_PATH, 'utf-8', function(err, data){
        if (err) throw err;

        fs.writeFile(TIMER_PATH, JSON.stringify(timer), 'utf-8', function (err) {
            if (err) throw err;

            console.log('filelistAsync complete');
        });
    });
};

module.exports.changeConfig = async (req, res, next) => {
    const config = req.body;

    fs.readFile(CONFIG_PATH, 'utf-8', function(err, data){
        if (err) throw err;

        fs.writeFile(CONFIG_PATH, JSON.stringify(config), 'utf-8', function (err) {
            if (err) throw err;

            console.log('filelistAsync complete');
        });
    });
};