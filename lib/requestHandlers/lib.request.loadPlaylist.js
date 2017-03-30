'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_LoadPlaylist extends RequestMediaRenderer
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

        if(!value)
        {
            this.logError("'value' parameter has to be set");
            _reject(new Error("'value' parameter has to be set"));
            return;
        }

        _mediaRendererVirtual.loadPlaylist(value, trackNumber).then(function(_data){
                _resolve(_data);
            }).catch(function(_data){
                _reject(_data);
            });
    }
}