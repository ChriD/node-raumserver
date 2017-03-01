'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_SeekToTrack extends RequestMediaRenderer
{
    constructor()
    {
        super();
    }
    
    
    isAllowedForRoomRenderer()
    {
        return false;
    }
    
    
    runAction(_resolve, _reject, _mediaRendererVirtual, _mediaRendererRoom, _roomUdn)
    {
        var trackIndex = parseInt(this.getQueryValue("trackIndex" , -1));
        var trackNumber = parseInt(this.getQueryValue("trackNumber" , -1));
        
        if(trackNumber < 1)
            trackNumber = trackIndex + 1;
        
        if(trackIndex < 0 && trackNumber < 1)
        {
            this.logError("'trackIndex' or 'trackNumber' parameter not ok");
            _reject("'trackIndex' or 'trackNumber' parameter not ok");
            return;
        }
    
        _mediaRendererVirtual.seek("TRACK_NR", trackNumber).then(function(_data){
                _resolve(_data);
            }).catch(function(_data){
                _reject(_data);
            });
    }
}
