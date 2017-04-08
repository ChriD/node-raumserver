'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_EnterAutomaticStandby extends RequestMediaRenderer
{
    constructor()
    {
        super();
    }
    
    
    async runAction(_resolve, _reject, _mediaRendererVirtual, _mediaRendererRoom, _roomUdn)
    {
        if(_mediaRendererRoom)
        {
            _mediaRendererRoom.enterAutomaticStandby().then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
        else
        {
            var resultSum = {};
            var rendererUdns = _mediaRendererVirtual.getRoomRendererUDNs();
            for(var rendererIdx=0; rendererIdx<rendererUdns.length; rendererIdx++)
            {
                var mediaRendererRoom = this.managerDisposer.deviceManager.getMediaRenderer(rendererUdns[rendererIdx]);
                if(mediaRendererRoom)
                {
                    try
                    {                                        
                        var result = await mediaRendererRoom.enterAutomaticStandby();
                        resultSum += result;
                    }
                    catch(_exception)
                    {
                        // we may get exceptions for devices which do not have a standby mode so catch the error
                        // but do not stop the code running!
                        this.logError(_exception.toString());
                    }
                }
            }            
            _resolve(resultSum);
        }
    }
}