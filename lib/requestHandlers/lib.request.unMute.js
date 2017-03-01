'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_UnMute extends RequestMediaRenderer
{
    constructor()
    {
        super();
    }
    
    
    runAction(_resolve, _reject, _mediaRendererVirtual, _mediaRendererRoom, _roomUdn)
    {
        if(_mediaRendererVirtual && _roomUdn)
        {
            _mediaRendererVirtual.setRoomMute(_roomUdn, 0).then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
        else if (_mediaRendererVirtual)
        {
            _mediaRendererVirtual.setMute(0).then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
        else
        {
            _mediaRendererRoom.setMute(0).then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
    }
}