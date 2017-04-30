'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_LoadSingle extends RequestMediaRenderer
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
        var value = this.getQueryValue("value", "");

        _mediaRendererVirtual.loadSingle(value, "", false, this.waitTillConfirmed()).then(function(_data){
                _resolve(_data);
            }).catch(function(_data){
                _reject(_data);
            });
    }
}