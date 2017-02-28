'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_Mute extends RequestMediaRenderer
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
        var value = parseInt(this.getQueryValue("value", 1));        
        
        if(_roomUdn)
        {
            _mediaRenderer.setRoomMute(_roomUdn, value).then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
        else
        {
            _mediaRenderer.setMute(value).then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
    }
}