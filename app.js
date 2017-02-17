//var RaspiCam = require("raspicam");

//var camera = new RaspiCam({ mode: 'photo', output: '/home/pi/3dCamera/output.jpg'});

//const Raspistill = require('node-raspistill').Raspistill;
//const camera = new Raspistill();

var socket = require('socket.io/node_modules/socket.io-client')('http://192.168.2.27:3000/');

var fs = require('fs');

var lastReceiveTime;
var takeId;

var imagePath = '/home/pi/3dCamera/';
var imageName = 'output.jpg';


//camera.on("started", function(){ 
//    console.log("started")
//});


socket.on('take-photo', function(data){
    console.log("Taking a photo");
    
    lastReceiveTime = data.time
    takeId          = data.takeId;
    
    //var photoId = guid();
    //camera.set('output', '/home/pi/3dCamera/images/' + photoId + '.jpg');
    //camera.start({timeout: 0 });
    
    camera.takePhoto().then(function(photo) {
        console.log(photo);
    });
    
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
});

function getAbsoluteImagePath() {
    return path.join(__dirname, imagePath, imageName);
}

function sendImage() {
    fs.readFile(getAbsoluteImagePath(), function(err, buffer){
        //io.sockets.emit('live-stream', buffer.toString('base64'));
        socket.emit('new-photo', {data:buffer.toString('base64'), takeId:takeId, startTime:lastReceiveTime, time:Date.now()});
    });
}

function takeImage() {
    var args = [
        //'-w', config['image-width'],   // width
        //'-h', config['image-height'],  // height
        '-t', 100,  // how long should taking the picture take?
        '-o', getAbsoluteImagePath()   // path + name
    ];
    process = spawn('raspistill', args);
    process.on('exit', sendImage);
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
