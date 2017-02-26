'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_FadeToVolume extends RequestMediaRenderer
{
    constructor()
    {
        super();
    }
    
    
    useZoneRenderer()
    {
        return true;
    }
    
    
    useRelativeValue()
    {
        var relative = parseInt(this.getQueryValue("relative" , 0)); 
        if(relative)
            return true;
        return false;
    }
    
    
    volumeMultiplier()
    {
        return 1;
    }
    
    
    runAction(_resolve, _reject, _mediaRenderer)
    {
        var self = this;
        var value = parseInt(this.getQueryValue("value", 0));
        var duration = parseInt(this.getQueryValue("duration", 0));
        var scope = this.getQueryValue("scope" , "").toLowerCase();
        var id = this.getQueryValue("id" , "");
        
        if(scope == "room")
        {
            // TODO: @@@
            /*
            var mediaRendererRoom = this.managerDisposer.deviceManager.getMediaRenderer(id);
            if(mediaRendererRoom)
            {
                var roomUDN = mediaRendererRoom.roomUdn(); 
                
                if(this.useRelativeValue())
                {
                    _mediaRenderer.getRoomVolume(roomUDN).then(function(_volumeNow){
                        _mediaRenderer.setRoomVolume(roomUDN, parseInt(_volumeNow) + (parseInt(value) * self.volumeMultiplier())).then(function(_data){
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
                    _mediaRenderer.setRoomVolume(roomUDN, value * self.volumeMultiplier()).then(function(_data){
                            _resolve(_data);
                        }).catch(function(_data){
                            _reject(_data);
                        });
                }
                
            }
            else
            {
                this.logError("Room with id '" + id + "' not found");
                _reject("Room with id '" + id + "' not found");
            }
            */
        }
        else
        {
            /*if(this.useRelativeValue())
            {
                _mediaRenderer.getVolume().then(function(_volumeNow){
                    _mediaRenderer.setVolume(parseInt(_volumeNow) + (parseInt(value) * self.volumeMultiplier())).then(function(_data){
                            _resolve(_data);
                        }).catch(function(_data){
                            _reject(_data);
                        });
                    }).catch(function(data){
                        _reject(_data);
                    });
            }
            else*/
            {
                _mediaRenderer.fadeToVolume(value *  self.volumeMultiplier(), duration).then(function(_data){
                        _resolve(_data);
                    }).catch(function(_data){
                        _reject(_data);
                    });
            }
        }
    }
}