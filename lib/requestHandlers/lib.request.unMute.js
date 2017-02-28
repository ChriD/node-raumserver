'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_UnMute extends RequestMediaRenderer
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
        if(_roomUdn)
        {
            _mediaRenderer.setRoomMute(_roomUdn, 0).then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
        else
        {
            _mediaRenderer.setMute(0).then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
    }
}