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
    
    
    runAction(_resolve, _reject, _mediaRenderer, _mediaRendererRoom, _roomUdn)
    {
        var self = this;
        var value = parseInt(this.getQueryValue("value", 0));
        var duration = parseInt(this.getQueryValue("duration", 0));
        
        if(_roomUdn)
        {
            if(this.useRelativeValue())
            {
                _mediaRenderer.getRoomVolume(_roomUdn).then(function(_volumeNow){
                    _mediaRenderer.fadeToVolumeRoom(_roomUdn, parseInt(_volumeNow) + (parseInt(value) * self.volumeMultiplier())).then(function(_data){
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
                _mediaRenderer.fadeToVolumeRoom(_roomUdn, value *  self.volumeMultiplier(), duration).then(function(_data){
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
                _mediaRenderer.getVolume().then(function(_volumeNow){
                    _mediaRenderer.fadeToVolume(parseInt(_volumeNow) + (parseInt(value) * self.volumeMultiplier())).then(function(_data){
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
                _mediaRenderer.fadeToVolume(value *  self.volumeMultiplier(), duration).then(function(_data){
                        _resolve(_data);
                    }).catch(function(_data){
                        _reject(_data);
                    });
            }
        }
    }
}