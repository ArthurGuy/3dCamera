var RaspiCam = require("raspicam");

var camera = new RaspiCam({ mode: 'photo', output: '/home/pi/3dCamera/output.jpg'});

var socket = require('socket.io/node_modules/socket.io-client')('http://display.arthurguy.co.uk:3000');




camera.on("started", function(){ 
    console.log("started")
});



socket.on('client-count', function(data){
    console.log("Taking a photo");
    //var photoId = guid();
    //camera.set('output', '/home/pi/3dCamera/images/' + photoId + '.jpg');
    camera.start({timeout: 0 });
});



//listen for the "read" event triggered when each new photo/video is saved
camera.on("read", function(err, timestamp, filename){
    console.log("new file available", timestamp, filename);
    camera.stop();
});



socket.on('connect', function(){
    console.log('A socket connection was made');
});
  
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
