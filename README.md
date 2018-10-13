# 3D Camera Client Software

This software is designed to run on the raspbery pi and use the raspbery pi camera, it should work on all versions of the hardware but it will be faster and more reliable with the newer devices.


## Getting started
The first thing you need to do is setup a raspbery pi, ideally with a lite version of Raspbian. Once this is setup you should ssh into it. How to do this is outside of the scope of this setup guide.

Once logged into the pi, enable the camera using the setup utility.
```bash
raspi-config
```

Once the camera is enabled, use the following commands to install all packages required for the 3DCamera software to run.

#### Installing Required Packages
```bash
# Install Node
cd ~
sudo apt-get install nodejs

# Install NPM
cd ~
wget https://nodejs.org/dist/v8.12.0/node-v8.12.0-linux-armv6l.tar.xz
tar xf node-v8.12.0-linux-armv6l.tar.xz
cd node-v8.12.0-linux-armv6l/
sudo cp -R * /usr/local/

# Tidy up
cd ~
rm node-v7.9.0-linux-armv6l.tar.gz.gz
rm -r node-v7.9.0-linux-armv6l
sudo reboot

# Update NPM
sudo npm install -g npm

# Install Git
sudo apt-get install git
```

Once node, npm and git have been installed the 3dCamera client software can be downloaded.

```bash
cd ~
git clone https://github.com/ArthurGuy/3dCamera.git
```

The 3dCamera client software can then be installed using the following commands:
```bash
cd 3dCamera
npm install
```

Once this is complete, test the software by running it using the following command:
```bash
node app.js
```

### Supervisor - Keeping the software running

Starting the software and keeping it running is the job of supervisor, this program will make sure the camera software allways runs, this can be installed using the following command.

```bash
sudo apt-get install supervisor
```

Supervisor can then be setup with the 3d scanner application by copying the supplied config file into the final location using the following command
```bash
sudo cp /home/pi/3dCamera/camera.conf /etc/supervisor/conf.d/camera.conf
```
You can now tell supervisor to identify the new config file and start running.

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo service supervisor restart
```
Now whenever the system starts up supervisor will start the camera application which will connect to the server software automatically.


## Optional extra

The software can be updated using an update command built into the web ui, an alternative is to force an update whenever the raspbery pi boots up. If you wish to do this you should enter the following command, this will replace the default startup script with one that will carry out an update.
```bash
sudo cp /home/pi/3dCamera/rc.local /etc/rc.local
```
