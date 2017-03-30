'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_Single extends RequestMediaRenderer
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

        _mediaRendererVirtual.loadSingle(value).then(function(_data){
                _resolve(_data);
            }).catch(function(_data){
                _reject(_data);
            });
    }
}