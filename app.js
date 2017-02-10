var RaspiCam = require("raspicam");

var camera = new RaspiCam({ mode: 'photo', output: '/home/pi/3dCamera/output.jpg' });

var socket = require('socket.io/node_modules/socket.io-client')('http://display.arthurguy.co.uk:3000');



camera.on("started", function(){ 
    console.log("started")
});

//listen for the "read" event triggered when each new photo/video is saved
camera.on("read", function(err, timestamp, filename){
    console.log("read");
    camera.stop();
});

socket.on('connect', function(){
    console.log('A socket connection was made');
});
  
socket.on('client-count', function(data){
    console.log("Taking a photo");
    camera.start({timeout: 0});
});
