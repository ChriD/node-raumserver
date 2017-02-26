'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_SetPlayMode extends RequestMediaRenderer
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
        var playMode = this.getQueryValue("mode" , "");
        
        if( playMode != "NORMAL"        &&
            playMode != "SHUFFLE"       &&
            playMode != "REPEAT_ONE"    &&
            playMode != "REPEAT_ALL"    &&
            playMode != "DIRECT_1"      &&
            playMode != "RANDOM"        )
        {
            this.logError("playMode '" + playMode + "' not valid");
            _reject("playMode '" + playMode + "' not valid");
            return;
            
        }
    
        _mediaRenderer.setPlayMode(playMode).then(function(_data){
                _resolve(_data);
            }).catch(function(_data){
                _reject(_data);
            });
    }
}