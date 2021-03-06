const appConfig = require('./config')
const spiderCall = require('./spider')
const dbPatcher = require('./dbPatcher')
const startSphinx = require('./sphinx')

const http = require('http')
const express = require('express');
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const path = require('path')
const os = require('os')

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

server.listen(appConfig.httpPort);
console.log('Listening web server on', appConfig.httpPort, 'port')
console.log('Platform:', os.platform())
console.log('Arch:', os.arch())
console.log('OS Release:', os.release())
console.log('CPU:', os.cpus()[0].model)
console.log('CPU Logic cores:', os.cpus().length)
console.log('Total memory:', (os.totalmem() / (1024 * 1024)).toFixed(2), 'MB')
console.log('Free memory:', (os.freemem() / (1024 * 1024)).toFixed(2), 'MB')
console.log('NodeJS:', process.version)

const majorVersion = /v?([0-9]+)\.?([0-9]+)?\.?([0-9]+)?\.?([0-9]+)?/.exec(process.version)[1]
if(majorVersion < 8)
{
	console.log('Minumum Node.JS version >= 8.0.0, please update and try again')
	process.exit(1);
}

app.use(express.static('web'));

const socketMessages = {}

io.on('connection', (socket) =>
{
	for(const message in socketMessages)
	{
		socket.on(message, socketMessages[message])
	}
})

sphinx = startSphinx(() => {
	dbPatcher(() => {
		spider = new spiderCall((...data) => io.sockets.emit(...data), (message, callback) => {
			socketMessages[message] = callback
		}, path.resolve(packageJson.serverDataDirectory), packageJson.version, 'production')
	}, null, sphinx)
}, path.resolve(packageJson.serverDataDirectory), () => {})


var rl = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on("SIGINT", function () {
	process.emit("SIGINT");
});

process.on("SIGINT", () => {
	if(spider)
	{
		spider.stop(() => sphinx.stop(() => process.exit()))
	}
	else
	{
		sphinx.stop(() => process.exit())
	}
});