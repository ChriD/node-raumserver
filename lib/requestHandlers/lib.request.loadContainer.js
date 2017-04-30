'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_LoadContainer extends RequestMediaRenderer
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
        var trackNumber = parseInt(this.getQueryValue("trackNumber", 1));     

        _mediaRendererVirtual.loadContainer(value, "", trackNumber, false, this.waitTillConfirmed()).then(function(_data){
                _resolve(_data);
            }).catch(function(_data){
                _reject(_data);
            });
    }
}