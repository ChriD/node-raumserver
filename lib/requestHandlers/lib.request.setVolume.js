'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_SetVolume extends RequestMediaRenderer
{
    constructor()
    {
        super();
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
    
    
    async runAction(_resolve, _reject, _mediaRendererVirtual, _mediaRendererRoom, _roomUdn)
    {
        var self = this;
        var value = parseInt(this.getQueryValue("value", -1));
        var equalRooms = parseInt(this.getQueryValue("euqalRooms", 0));


        // if we have the 'euqlRooms' set, we do have to set the value directly on the given rooms for the zone, so that all
        // rooms will have the same volume value. Equal rooms only works if not relative of course.
        if(_mediaRendererVirtual && equalRooms)
        {            
            var resultSum = {};
            var rendererUdns = _mediaRendererVirtual.getRoomRendererUDNs();
            for(var rendererIdx=0; rendererIdx<rendererUdns.length; rendererIdx++)
            {
                try
                { 
                    var mediaRendererRoom = this.managerDisposer.deviceManager.getMediaRenderer(rendererUdns[rendererIdx]);
                    if(mediaRendererRoom)
                    {
                        var result = await mediaRendererRoom.setVolume(value * self.volumeMultiplier(), this.waitTillConfirmed());
                        resultSum += result;
                    }
                }
                catch(_exception)
                {
                    // catch errors and reject
                    this.logError(_exception.toString());
                    _reject(_exception);
                    return;                    
                }
            }
             _resolve(resultSum);              
            return;
        }

        
        if(_mediaRendererVirtual && _roomUdn)
        {
            if(this.useRelativeValue())
            {
                _mediaRendererVirtual.getRoomVolume(_roomUdn).then(function(_volumeNow){
                    _mediaRendererVirtual.setRoomVolume(_roomUdn, parseInt(_volumeNow) + (parseInt(value) * self.volumeMultiplier())).then(function(_data){
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
                _mediaRendererVirtual.setRoomVolume(_roomUdn, value * self.volumeMultiplier()).then(function(_data){
                        _resolve(_data);
                    }).catch(function(_data){
                        _reject(_data);
                    });
            }
        }
        else if (_mediaRendererVirtual)
        {
            if(this.useRelativeValue())
            {
                _mediaRendererVirtual.getVolume().then(function(_volumeNow){
                    _mediaRendererVirtual.setVolume(parseInt(_volumeNow) + (parseInt(value) * self.volumeMultiplier()), this.waitTillConfirmed()).then(function(_data){
                            _resolve(_data);
                        }).catch(function(_data){
                            _reject(_data);
                        });
                    }).catch(function(data){
                        _reject(_data);
                    });
            }
            else
            {
                _mediaRendererVirtual.setVolume(value *  self.volumeMultiplier(), this.waitTillConfirmed()).then(function(_data){
                        _resolve(_data);
                    }).catch(function(_data){
                        _reject(_data);
                    });
            }
        }
        else
        {
            if(this.useRelativeValue())
            {
                _mediaRendererRoom.getVolume().then(function(_volumeNow){
                    _mediaRendererRoom.setVolume(parseInt(_volumeNow) + (parseInt(value) * self.volumeMultiplier()), this.waitTillConfirmed()).then(function(_data){
                            _resolve(_data);
                        }).catch(function(_data){
                            _reject(_data);
                        });
                    }).catch(function(data){
                        _reject(_data);
                    });
            }
            else
            {
                _mediaRendererRoom.setVolume(value *  self.volumeMultiplier(), this.waitTillConfirmed()).then(function(_data){
                        _resolve(_data);
                    }).catch(function(_data){
                        _reject(_data);
                    });
            }
        }
    }
}