'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_EnterAutomaticStandby extends RequestMediaRenderer
{
    constructor()
    {
        super();
    }
    
    
    runAction(_resolve, _reject, _mediaRendererVirtual, _mediaRendererRoom, _roomUdn)
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
            // TODO: run through all room renderers for the given virtual MediaRenderer and call the standby method
            _reject();
        }
    }
}