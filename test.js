'use strict'; 
var Raumserver = require('./lib/lib.raumserver');

var raumserver = new Raumserver();

raumserver.createLogger(4);
raumserver.init();


function execute(){

}

setInterval(execute,1000);