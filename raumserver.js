'use strict'; 
var Config = require('config');
var Raumserver = require('./lib/lib.raumserver');

var raumserver = new Raumserver();

setConfiguration("raumserver", "port");
setConfiguration("raumserver", "loglevel");
setConfiguration("raumfeld", "raumfeldHost");
setConfiguration("raumfeld", "raumfeldHostRequestPort");
setConfiguration("raumfeld", "raumfeldManufacturerId");
setConfiguration("raumfeld", "raumfeldVirtualMediaPlayerModelDescription");
setConfiguration("raumfeld", "alivePingerIntervall");
setConfiguration("raumfeld", "ssdpDiscovertimeout");
setConfiguration("raumfeld", "bonjourDiscoverTimeout");
setConfiguration("raumfeld", "uriMetaDataTemplateFile");
setConfiguration("raumfeld", "rendererStateTriggerConfirmationTimout");
setConfiguration("raumfeld", "zoneTriggerConfirmationTimout");


//raumserver.createLogger(4);
raumserver.init();


function setConfiguration(_object, _key) {
    try
    {
        if(_object == "raumserver")
            raumserver.settings[_key] = Config.get(_object + '.' + _key); 
        else
            raumserver.raumkernel.settings[_key] = Config.get(_object + '.' + _key);   
    }
    catch(_exception)
    {
        raumserver.logError("Configuration key '" + _object + "." + _key + "' not set! Using default!", _exception);
    } 
}

function execute() {
}

setInterval(execute,1000);

