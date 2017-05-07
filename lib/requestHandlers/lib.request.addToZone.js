'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_AddToZone extends RequestMediaRenderer
{
    constructor()
    {
        super();
    }
    
    
    isAllowedForVirtualRenderer()
    {
        return false;
    }
    
    
    isRoomScope()
    {
        return true;
    }
    
    
    runAction(_resolve, _reject, _mediaRendererVirtual, _mediaRendererRoom, _roomUdn)
    {
        var zoneId = this.getQueryValue("zoneId");
        var _mediaRendererZone = this.managerDisposer.deviceManager.getVirtualMediaRenderer(zoneId);
        
        if(_mediaRendererZone)
        {
            this.managerDisposer.zoneManager.connectRoomToZone(_roomUdn, _mediaRendererZone.udn(), this.waitTillConfirmed()).then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
        else
        {
            _reject(new Error("Zone for zoneId '" + zoneId + "' not found!"));
        }
    }

}