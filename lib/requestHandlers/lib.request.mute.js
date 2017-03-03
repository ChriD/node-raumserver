'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_Mute extends RequestMediaRenderer
{
    constructor()
    {
        super();
    }
    
    
    runAction(_resolve, _reject, _mediaRendererVirtual, _mediaRendererRoom, _roomUdn)
    {
        var value = parseInt(this.getQueryValue("value", 1));        
        
        if(_mediaRendererVirtual && _roomUdn)
        {
            _mediaRendererVirtual.setRoomMute(_roomUdn, value).then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
        else if(_mediaRendererVirtual)
        {
            _mediaRendererVirtual.setMute(value).then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
        else
        {
            _mediaRendererRoom.setMute(value).then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
    }
}