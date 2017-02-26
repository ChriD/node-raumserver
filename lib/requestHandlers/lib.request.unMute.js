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
    
    runAction(_resolve, _reject, _mediaRenderer)
    {
        var scope = this.getQueryValue("scope" , "").toLowerCase();
        var id = this.getQueryValue("id" , "");
        
        if(scope == "room")
        {
            var mediaRendererRoom = this.managerDisposer.deviceManager.getMediaRenderer(id);
            if(mediaRendererRoom)
            {
                var roomUDN = mediaRendererRoom.roomUdn(); 
                _mediaRenderer.setRoomMute(roomUDN, 0).then(function(_data){
                        _resolve(_data);
                    }).catch(function(_data){
                        _reject(_data);
                    });
            }
            else
            {
                this.logError("Room with id '" + id + "' not found");
                _reject("Room with id '" + id + "' not found");
            }
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