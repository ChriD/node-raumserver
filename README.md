# node-raumserver
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/ChriD/)
[![npm:?](https://img.shields.io/npm/v/node-raumserver.svg?style=flat-square)](https://www.npmjs.com/packages/node-raumserver)
[![dependencies:?](https://img.shields.io/npm/dm/node-raumserver.svg?style=flat-square)](https://www.npmjs.com/packages/node-raumserver)  

[![NPM](https://nodei.co/npm/node-raumserver.png?downloads=true&downloadRank=true)](https://nodei.co/npm/node-raumserver/)

A nodejs module to control the raumfeld multiroomsystem via HTTP-Requests  
**Please check the [wiki](https://github.com/ChriD/node-raumserver/wiki) for install information and how to use the server** 

**Another wiki can be found here [gahujipo-wiki](https://github.com/gahujipo/node-raumserver-wiki). Thanks to gahujipo for creating this!**


Installation
-------------

### Via NPM
create a folder with a name of your choice  
open command line\console in the folder and do following  
```
npm install node-raumserver
cd node_modules/node-raumserver
npm start
```

### Via Docker image
Search for **docker-raumserver** and install it.  
You have to use `net=--host` for the container, otherwise the raumserver will not find any devices.  
Docker raumserver will reside on **port 8585**  
**INFO: Docker image is currently outdated!**

Changelog
-------------
Changelog can be found [here](https://github.com/ChriD/node-raumserver/releases)  


Requirements
-------------
Please use with node version 7.x or above  
For Version lower than 7.6.0 the --harmony-async-await parameter has to be used
