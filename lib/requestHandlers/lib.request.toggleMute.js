'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_ToggleMute extends RequestMediaRenderer
{
    constructor()
    {
        super();
    }
    
    
    runAction(_resolve, _reject, _mediaRendererVirtual, _mediaRendererRoom, _roomUdn)
    {
        var self = this;
        var mute = 0;
        
        if(_mediaRendererVirtual && _roomUdn)
        {
            _mediaRendererVirtual.getRoomMute(_roomUdn).then(function(_muteNow){                
                if(_muteNow == 0) mute = 1;
                _mediaRendererVirtual.setRoomMute(_roomUdn, mute).then(function(_data){
                        _resolve(_data);
                    }).catch(function(_data){
                        _reject(_data);
                    });
                }).catch(function(_data){
                    _reject(_data);
                });
        }
        else if(_mediaRendererVirtual)
        {
            _mediaRendererVirtual.getMute().then(function(_muteNow){                 
                if(_muteNow == 0) mute = 1;
                _mediaRendererVirtual.setMute(mute).then(function(_data){
                        _resolve(_data);
                    }).catch(function(_data){
                        _reject(_data);
                    });
                }).catch(function(_data){
                    _reject(_data);
                });
        }
        else
        {
            _mediaRendererRoom.getMute().then(function(_muteNow){                 
                if(_muteNow == 0) mute = 1;
                _mediaRendererRoom.setMute(mute).then(function(_data){
                        _resolve(_data);
                    }).catch(function(_data){
                        _reject(_data);
                    });
                }).catch(function(_data){
                    _reject(_data);
                });
        }
    }
}