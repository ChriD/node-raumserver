'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_SleepTimer extends RequestMediaRenderer
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
        var secondsUntilSleep = parseInt(this.getQueryValue("secondsUntilSleep", 0));
        var secondsForVolumeRamp = parseInt(this.getQueryValue("secondsForVolumeRamp", 0));
    
        if(secondsUntilSleep > 0)
        {
            _mediaRenderer.startSleepTimer(secondsUntilSleep, secondsForVolumeRamp).then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
        else
        {
            _mediaRenderer.cancelSleepTimer().then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
    }
}