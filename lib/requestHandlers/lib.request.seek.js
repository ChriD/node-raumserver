'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_Seek extends RequestMediaRenderer
{
    constructor()
    {
        super();
    }
    
    
    useZoneRenderer()
    {
        return true;
    }
    
    runAction(_resolve, _reject, _mediaRenderer)
    {
        var value = parseInt(this.getQueryValue("value" , -1));
        var relative = parseInt(this.getQueryValue("relative" , 0));
        var seekType = "ABS_TIME";
        
        if(relative)
            seekType = "REL_TIME";
            
        // Convert seconds to "HH:MM:SS"
        this.logDebug("Seek " + seekType + " to: " + this.secondsToHHMMSS(value));
        _mediaRenderer.seek(seekType, this.secondsToHHMMSS(value)).then(function(_data){
                _resolve(_data);
            }).catch(function(_data){
                _reject(_data);
            });
    }
    
    secondsToHHMMSS(_seconds)
    {
        var hours   = Math.floor(_seconds / 3600);
        var minutes = Math.floor((_seconds - (hours * 3600)) / 60);
        var seconds = _seconds - (hours * 3600) - (minutes * 60);

        // round seconds
        seconds = Math.round(seconds * 100) / 100

        var result = (hours < 10 ? "0" + hours : hours);
            result += ":" + (minutes < 10 ? "0" + minutes : minutes);
            result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
        return result;
    }
}
