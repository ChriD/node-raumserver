'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_SleepTimer extends RequestMediaRenderer
{
    constructor()
    {
        super();
    }
    
    
    isAllowedForRoomRenderer()
    {
        return false;
    }
    
    
    runAction(_resolve, _reject, _mediaRendererVirtual, _mediaRendererRoom, _roomUdn)
    {
        var secondsUntilSleep = parseInt(this.getQueryValue("secondsUntilSleep", 0));
        var secondsForVolumeRamp = parseInt(this.getQueryValue("secondsForVolumeRamp", 0));
    
        if(secondsUntilSleep > 0)
        {
            _mediaRendererVirtual.startSleepTimer(secondsUntilSleep, secondsForVolumeRamp).then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
        else
        {
            _mediaRendererVirtual.cancelSleepTimer().then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
    }
}