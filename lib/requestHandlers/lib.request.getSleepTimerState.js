'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_GetSleepTimerState extends RequestMediaRenderer
{
    constructor()
    {
        super();
    }
    
    
    useZoneRenderer()
    {
        return true;
    }
    
    runAction(_resolve, _reject, _mediaRenderer, _mediaRendererRoom, _roomUdn)
    {
        _mediaRenderer.getSleepTimerState().then(function(_data){
                _resolve(_data);
            }).catch(function(_data){
                _reject(_data);
            });
    }
}