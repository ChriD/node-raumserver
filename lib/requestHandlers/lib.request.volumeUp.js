'use strict'; 
var RequestSetVolume = require('./lib.request.setVolume');

module.exports = class Request_VolumeUp extends RequestSetVolume
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

    
}