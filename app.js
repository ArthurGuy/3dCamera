
var args = process.argv.slice(2);

var socketServer;
if (typeof args[0] != 'undefined') {
    socketServer = 'http://' + args[0];
} else {
    socketServer = 'http://192.168.2.27:3000/';
}

var spawn = require('child_process').spawn;
var path = require('path');

var socket = require('socket.io/node_modules/socket.io-client')(socketServer);

var fs = require('fs');

// Random name generator
var marvel = require('marvel-characters')

var lastReceiveTime;
var takeId;

var imagePath = '/';
var imageName = 'output.jpg';

var cameraName = marvel();


socket.on('take-photo', function(data){
    console.log("Taking a photo");
    
    lastReceiveTime = data.time
    takeId          = data.takeId;
    
    takeImage();
    
});

/*

//listen for the "read" event triggered when each new photo/video is saved
camera.on("read", function(err, timestamp, filename){
    console.log("new file available", timestamp, filename);
    camera.stop();
    var filePath = __dirname + '/output.jpg';
    
    //var imageData = fs.readFileSync(filePath,'utf8');
    //console.log(imageData.toString('base64'));
    //socket.emit('new-photo', {data:imageData.toString('base64')});
    
    fs.readFile(filePath, function (err, data) {
        if (err) {
            return console.log(err);
        }
        //console.log(data.toString('base64'));
        console.log("Sending photo");
        socket.emit('new-photo', {data:data.toString('base64'), takeId:takeId, startTime:lastReceiveTime, time:Date.now()});
        
        console.log("Deleting photo");
        fs.unlink(filePath);
    });
 
});
*/


socket.on('connect', function(){
    console.log('A socket connection was made');
    
    socket.emit('camera-online', {name: cameraName});
});

function getAbsoluteImagePath() {
    return path.join(__dirname, imagePath, imageName);
}

function sendImage() {
    fs.readFile(getAbsoluteImagePath(), function(err, buffer){
        
        if (typeof buffer == 'undefined') {
            socket.emit('photo-error', {takeId:takeId});
            return;
        }
        //console.log(err);
        //console.log(buffer);
        //io.sockets.emit('live-stream', buffer.toString('base64'));
        socket.emit('new-photo', {data: buffer.toString('base64'), takeId:takeId, startTime:lastReceiveTime, time:Date.now()});
    });
}

function takeImage() {
    var args = [
        //'-w', 640,   // width
        //'-h', 480,  // height
        //'-t', 100,  // how long should taking the picture take?
        '-o', getAbsoluteImagePath()   // path + name
    ];
    var imageProcess = spawn('raspistill', args);
    imageProcess.on('exit', sendImage);
}
  
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
