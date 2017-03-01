'use strict'; 
var RequestSetVolume = require('./lib.request.setVolume');

module.exports = class Request_VolumeDown extends RequestSetVolume
{
    constructor()
    {
        super();
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