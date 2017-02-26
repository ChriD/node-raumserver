'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_SetVolume extends RequestMediaRenderer
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
        var value = parseInt(this.getQueryValue("value", -1));
        var relative = parseInt(this.getQueryValue("relative" , 0));
        var scope = this.getQueryValue("scope" , "").toLowerCase();
        var id = this.getQueryValue("id" , "");
        
        if(relative)
        {
            //TODO: @@@
        }
        
        if(scope == "room")
        {
            var mediaRendererRoom = this.managerDisposer.deviceManager.getMediaRenderer(id);
            if(mediaRendererRoom)
            {
                var roomUDN = mediaRendererRoom.roomUdn(); 
                _mediaRenderer.setRoomVolume(roomUDN, value).then(function(_data){
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
            _mediaRenderer.setVolume(value).then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
    }
}