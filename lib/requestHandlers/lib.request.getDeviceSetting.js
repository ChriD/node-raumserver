'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_GetDeviceSetting extends RequestMediaRenderer
{
    constructor()
    {
        super();
    }
    
    
    isAllowedForRoomRenderer()
    {
        return true;
    }

    isAllowedForVirtualRenderer()
    {
        return false;
    }

    isRoomScope()
    {
       return true;
    }
    
    
    runAction(_resolve, _reject, _mediaRendererVirtual, _mediaRendererRoom, _roomUdn)
    {
        if(!_mediaRendererRoom)
            _reject(new Error("This request needs a room identifier!"));

        var key = this.getQueryValue("key", "");

        if(!key)
            _reject(new Error("This request needs a key option"));

        _mediaRendererRoom.getDeviceSetting(key).then(function(_data){
                _resolve(_data);
            }).catch(function(_data){
                _reject(_data);
            });
    }
}