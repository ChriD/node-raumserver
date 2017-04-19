'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_DropFromZone extends RequestMediaRenderer
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
        this.managerDisposer.zoneManager.dropRoomFromZone(_roomUdn).then(function(_data){
                _resolve(_data);
            }).catch(function(_data){
                _reject(_data);
            });
    }

}