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
        var noVirtualRenderer = false;
        
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
                // if the room is not found but we have scoped it we have to give an error!
                if(!mediaRendererRoom)
                {
                    self.logError("Room with id '" + id + "' not found");
                    throw new Error("Room with id '" + id + "' not found");
                }
            }
            
            // if no virtual devices or no room renderer was found give an error
            if(!mediaRenderers.size && !mediaRendererRoom)
            {
                // if room scope is enabled we do give other error message as if room scope is disabled
                if(self.isRoomScope())
                {
                    self.logError("MediaRenderer for id '" + id + "' not found");
                    throw new Error("MediaRenderer for id '" + id + "' not found");
                }
                else
                {
                    self.logError("VirtualMediaRenderer for id '" + id + "' not found");
                    throw new Error("VirtualMediaRenderer for id '" + id + "' not found");
                }
            }
            
            // if there is no virtual renderer but a room renderer (this is the case when we address a room without a zone / unassigned room)
            // we do add the room renderer to the mediaRenderers map to be sure we run into the loop.
            if(!mediaRenderers.size)
            {
                noVirtualRenderer = true;
                mediaRenderers.set(mediaRendererRoom.udn(), mediaRendererRoom);
            }
            
            
            for (var udn of mediaRenderers.keys())
            {
                var mediaRenderer = mediaRenderers.get(udn);
                if(mediaRenderer)
                {
                    self.logDebug("Calling action '" + this.action + "' for renderer " + mediaRenderer.name());
                    try
                    {
                        // await the result of the media renderer action, if there is an error we will get into the 
                        // catch and we log the error but we try to execute  other renderers in listStyleType
                        // we do only provide a virtual renderer if we have found one. This is nearly always the case except
                        // we do some requests on unassigned rooms.
                        var data = await self.runActionForMediaRenderer(noVirtualRenderer ? null : mediaRenderer, mediaRendererRoom);
                        // if the return value is no object, then create an object and put the result into it                        
                        if(typeof data !== "object")
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
                else
                {
                    // well in fact this error is not really a big error in normal cases, it may occur when creation of a 
                    // zone is triggered twice or once in a while very fast (when renderer was removed but is listed in the
                    // zone configuration because it has not updated yet)
                    self.logError("Media renderer object for udn " + udn + " not existent"); 
                    rendererThrowedException = new Error("Media renderer object for udn " + udn + " not existent");
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