'use strict'; 
var RequestLongPolling = require('../lib.base.requestLongPolling');

module.exports = class Request_GetRendererState extends RequestLongPolling
{
    constructor()
    {
        super();
        this.mediaRenderer = null;
    }
    
    
    isRoomScope()
    {
        if(this.getQueryValue("scope") == "room")
            return true;
        return false;
    }
    
    
    init()
    {
        var id = this.getQueryValue("id");
        var scope = this.getQueryValue("scope");
    
        if(id)
        {
            // if scope is not 'room' we try to get the zone renderer, otherwise get the room renderer
            if(this.isRoomScope())
                this.mediaRenderer = this.managerDisposer.deviceManager.getMediaRenderer(id);
            else
                this.mediaRenderer = this.managerDisposer.deviceManager.getVirtualMediaRenderer(id);
        }
    }
    
    
    runAction(_resolve, _reject)
    {
        try
        {
            var id = this.getQueryValue("id");

            if(id)
            {
                if(!this.mediaRenderer)
                {
                    this.logError("Media Renderer for id '" + id + "' not found");
                    _reject(new Error("Media Renderer for id '" + id + "' not found"));
                }
                else
                {
                    var dataArray = [];
                    dataArray.push(this.createReturnData(this.mediaRenderer, this.mediaRenderer.rendererState))
                    _resolve(dataArray);
                }
            }
            else
            {
                // TODO: only add renderers to list which state has been updated??? of course only wehn updateId is given?!
                // TODO: Add all other renderers too? when set?
                var dataArray = [];
                for (var udn of this.managerDisposer.deviceManager.mediaRenderersVirtual.keys())
                {
                    var mediaRenderer = this.managerDisposer.deviceManager.mediaRenderersVirtual.get(udn);
                    if(mediaRenderer)
                    {
                        dataArray.push(this.createReturnData(mediaRenderer, mediaRenderer.rendererState))
                    }
                }
                
                for (var udn of this.managerDisposer.deviceManager.mediaRenderers.keys())
                {
                    var mediaRenderer = this.managerDisposer.deviceManager.mediaRenderers.get(udn);
                    if(mediaRenderer && mediaRenderer.isRaumfeldRenderer())
                    {
                        dataArray.push(this.createReturnData(mediaRenderer, mediaRenderer.rendererState))
                    }
                }
                 _resolve(dataArray);
            
                // TOO: @@@
                //this.logError("Not implemented yet!");
                //_reject(new Error("Not implemented yet!"));  
            }
        }
        catch(_exception)
        {
            this.logError(_exception);
            _reject(_exception);
        }
    }
    
    
    getCurrentUpdateId()
    {
        var id = this.getQueryValue("id");
        // if we have an id we should have a media renderer where we can get the updateId
        if(id)
        {
            if(!this.mediaRenderer)
            {
                this.logError("Media Renderer for id '" + id + "' not found");
                throw(new Error("Media Renderer for id '" + id + "' not found"));
            }
            return this.mediaRenderer.lastUpdateIdRendererState;
        }
        // if we have no Id we have to check if there was an update it changed on any of the renderers
        else
        {
            return this.getCombinedUpdateIdforRendererState();
        }
    }
    
    
    getCombinedUpdateIdforRendererState()
    {
        var combindedUpdateId = "";
    
        for (var udn of this.managerDisposer.deviceManager.mediaRenderersVirtual.keys())
        {
            var mediaRenderer = this.managerDisposer.deviceManager.mediaRenderersVirtual.get(udn);
            if(mediaRenderer)
            {
                combindedUpdateId += mediaRenderer.lastUpdateIdRendererState;
            }
        }
        
        return combindedUpdateId;
    }
    
    
    createReturnData(_mediaRenderer, _rendererState)
    {
        // create better return (rooms list in fact all others are okay!)
        var newStateObject = JSON.parse(JSON.stringify(_rendererState));
        // remove 'named' room array and add a 'normal' one instead
        delete newStateObject.rooms;
        newStateObject.rooms = [];
        newStateObject.udn = _mediaRenderer.udn();
        for(var udn in _rendererState.rooms)
        {
            newStateObject.rooms.push(_rendererState.rooms[udn]);
        }

        return newStateObject;
    }

}