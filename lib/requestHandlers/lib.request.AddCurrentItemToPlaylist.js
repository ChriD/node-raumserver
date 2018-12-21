// contribution by davie2000
// https://github.com/davie2000

'use strict';
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_addCurrentItemToPlaylist extends RequestMediaRenderer
{
    constructor()
    {
        super();
    }


    runAction(_resolve, _reject, _mediaRendererVirtual, _mediaRendererRoom, _roomUdn)
    {
        var _playlistName = this.getQueryValue("playlist");
        // INFO: The 'refId' may not only ba a playing track. In some cases it might be a container
        // But for the purpose of this request it seems good ebough to assume that its a direkt song link
        var _mediaItemId = _mediaRendererVirtual.currentMediaItemData.refID; // actual playing track

        if(!_playlistName)
        {
            this.logError("'playlist' parameter has to be set");
            _reject(new Error("'playlist' parameter has to be set"));
            return;
                }

        if(_mediaItemId)
        {
            this.raumkernel.nativePlaylistController.addItemToPlaylist(_playlistName, _mediaItemId).then(function(_data){
                    _resolve(_data);
                }).catch(function(_data){
                    _reject(_data);
                });
        }
        else
        {
                    this.logError("Currently playing track is not available!");
            _reject(new Error("Currently playing track is not available!"));
        }
    }

}