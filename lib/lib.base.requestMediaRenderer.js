'use strict'; 
var Request = require('./lib.base.request');

module.exports = class RequestMediaRenderer extends Request
{
    constructor()
    {
        super();
    }
    
    
    useZoneRenderer()
    {
        // always try to get the zine renderer first
        //if(this.getQueryValue("scope") == "room")
        //    return false;
        return true;
    }
    
    isRoomScope()
    {
        if(this.getQueryValue("scope") == "room")
            return true;
        return false;
    }
    
    
    isAllowedForVirtualRenderer()
    {
        return true;
    }
    
    
    isAllowedForRoomRenderer()
    {
        return true;
    }
    
    
    async run()
    {
        var self = this;
        var id = this.getQueryValue("id");
        var scope = this.getQueryValue("scope");        
        var rendererThrowedException = null;
        var returnData = null;
        
        // the request itself may use a forced scope. if so we have to use it!
        if(this.useZoneRenderer())
            scope = "zone";
        else
            scope = "room";
        
        try
        {
            // always get the zone renderer with the given id (no matter if this is the zone UDN or name of a room) 
            // there may be more than one if no identifier is given!
            var mediaRenderers = self.getMediaRenderersFromIdAndScope(id, "zone");
            var mediaRendererRoom = null;
            // if we have scoped the room and we do only have found one virtual renderer we can read the roomRenderer
            if(this.isRoomScope() && mediaRenderers.size <= 1)
            {
                mediaRendererRoom = self.managerDisposer.deviceManager.getMediaRenderer(id);
                if(!mediaRendererRoom)
                {
                    self.logError("Room with id '" + id + "' not found");
                    throw new Error("MediaRenderer for id '" + id + "' not found");
                }
                    
            }
            
            // if no virtual devices or no room renderer was found give an error
            if(!mediaRenderers.size && !mediaRendererRoom)
            {
                self.logError("MediaRenderer for id '" + id + "' not found");
                throw new Error("MediaRenderer for id '" + id + "' not found");
            }
            
            // if there is no virtual renderer but a room renderer (this is the case when we address a room without a zone)
            // we do add the room renderer as a dummy one to get into the loop
            if(!mediaRenderers.size)
                mediaRenderers.set(mediaRendererRoom.udn(), null);
            
            

            
            for (var udn of mediaRenderers.keys())
            {
                self.logDebug("Calling action '" + this.action + "' for renderer " + mediaRenderers.get(udn).name());
                try
                {
                    // await the result of the media renderer action, if there is an error we will get into the 
                    // catch and we log the error but we do throw it
                    var data = await self.runActionForMediaRenderer(mediaRenderers.get(udn), mediaRendererRoom);
                    // if the return value is no object, then create an object and put the result into it
                    if(data !== "object")
                        data = { "result" : data };
                    // add some information fields
                    data["udn"] = udn;
                    // sum up data from all renderers
                    if(mediaRenderers.size > 1)
                    {
                        if(returnData == null)
                            returnData = [];                        
                        returnData.push(data)
                    }
                    else
                    {
                        returnData = data;
                    }
                }
                catch(_execption)
                {
                    self.logError("Exception thrown: ", _execption);  
                    // do not stop executing the action on the other renderers, we try to do the action on the other
                    // renderers too, even if one failed! But we store that we had an exception and throw it afterwards                    
                    rendererThrowedException = _execption;
                }
            }
            
            // if we had an error in any of the renderers we throw the error to be sure the caller gets the error back
            if(rendererThrowedException)
                throw (rendererThrowedException);
        }
        catch(_exception)
        {
            self.logError("Some renderers had exceptions: ", _exception);
            throw _exception;
        }
        return returnData;
    } 
    
    /**
     * will be called each media renderer for what we have to execute the request
     * @param {Object} the media renderer class
     * @return {Promise} a promise if ok or not
     */
    runActionForMediaRenderer(_mediaRendererVirtual, _mediaRendererRoom)
    {
        var self = this;
        var scope = this.getQueryValue("scope" , "").toLowerCase();
        var id = this.getQueryValue("id" , "");
        
        return new Promise(function(_resolve, _reject){
        
            if(_mediaRendererRoom &&  !self.isAllowedForRoomRenderer())   
            {
                self.logError(self.action + " is not allowed to be used with room renderers!");
                _reject(new Error(self.action + " is not allowed to be used with room renderers!"));
            }
            else if(_mediaRendererVirtual &&  !_mediaRendererRoom &&  !self.isAllowedForVirtualRenderer())
            {
                self.logError(self.action + " is not allowed to be used with virtual renderers!");
                _reject(new Error(self.action + " is not allowed to be used with virtual renderers!"));  
            }
            else
            {
                self.runAction(_resolve, _reject, _mediaRendererVirtual, _mediaRendererRoom, (_mediaRendererRoom != null ? _mediaRendererRoom.roomUdn() : ""));
            }
        });
    }
}