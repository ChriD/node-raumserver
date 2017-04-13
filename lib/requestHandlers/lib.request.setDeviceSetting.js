'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_SetDeviceSetting extends RequestMediaRenderer
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
        var value = this.getQueryValue("value", "");

        if(!key || !value)
            _reject(new Error("This request needs a key and a value option"));

        _mediaRendererRoom.setDeviceSetting(key, value).then(function(_data){
                _resolve(_data);
            }).catch(function(_data){
                _reject(_data);
            });
    }
}