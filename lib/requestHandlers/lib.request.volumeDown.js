'use strict'; 
var RequestSetVolume = require('./lib.request.setVolume');

module.exports = class Request_VolumeDown extends RequestSetVolume
{
    constructor()
    {
        super();
    }
    
    
    useZoneRenderer()
    {
        return true;
    }
    
    
    useRelativeValue()
    {
        return true;
    }
    
    
    volumeMultiplier()
    {
        return -1;
    }
    
}