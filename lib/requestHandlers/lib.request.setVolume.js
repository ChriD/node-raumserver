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
    
    
    runAction(_resolve, _reject, _mediaRendererVirtual, _mediaRendererRoom, _roomUdn)
    {
        var self = this;
        var value = parseInt(this.getQueryValue("value", -1));
        
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
                    _mediaRendererVirtual.setVolume(parseInt(_volumeNow) + (parseInt(value) * self.volumeMultiplier())).then(function(_data){
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
                _mediaRendererVirtual.setVolume(value *  self.volumeMultiplier()).then(function(_data){
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
                    _mediaRendererRoom.setVolume(parseInt(_volumeNow) + (parseInt(value) * self.volumeMultiplier())).then(function(_data){
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
                _mediaRendererRoom.setVolume(value *  self.volumeMultiplier()).then(function(_data){
                        _resolve(_data);
                    }).catch(function(_data){
                        _reject(_data);
                    });
            }
        }
    }
}