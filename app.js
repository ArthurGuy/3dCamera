var RaspiCam = require("raspicam");

var camera = new RaspiCam({ mode: 'photo', output: '/home/pi/3dCamera/images/%d.jpg' });

camera.start({timeout: 0});

camera.on("started", function(){ 
    console.log("started")
});

//listen for the "read" event triggered when each new photo/video is saved
camera.on("read", function(err, timestamp, filename){
    console.log("read");
    camera.stop();
});
