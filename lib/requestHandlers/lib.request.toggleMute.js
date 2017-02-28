'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_ToggleMute extends RequestMediaRenderer
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
        var self = this;
        var mute = 0;
        
        if(_roomUdn)
        {
            _mediaRenderer.getRoomMute(_roomUdn).then(function(_muteNow){
                self.logWarning(_muteNow);
                if(_muteNow == 0) mute = 1;
                _mediaRenderer.setRoomMute(_roomUdn, mute).then(function(_data){
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
            _mediaRenderer.getMute().then(function(_muteNow){ 
                self.logWarning(_muteNow);
                if(_muteNow == 0) mute = 1;
                _mediaRenderer.setMute(mute).then(function(_data){
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