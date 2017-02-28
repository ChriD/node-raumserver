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
        if(this.getQueryValue("scope") == "room")
            return false;
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
        
        try
        {
            var mediaRenderers = self.getMediaRenderersFromIdAndScope(id, scope);
            if(!mediaRenderers.size)
            {
                self.logError("MediaRenderer for id '" + id + "' not found");
                throw ("MediaRenderer for id '" + id + "' not found");
            }
            
            for (var udn of mediaRenderers.keys())
            {
                self.logDebug("Calling action '" + this.action + "' for renderer " + mediaRenderers.get(udn).name());
                try
                {
                    // await the result of the media renderer action, if there is an error we will get into the 
                    // catch and we log the error but we do throw it
                    var data = await self.runActionForMediaRenderer(mediaRenderers.get(udn));
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
    runActionForMediaRenderer(_mediaRenderer)
    {
        var self = this;
        var scope = this.getQueryValue("scope" , "").toLowerCase();        
        var id = this.getQueryValue("id" , "");
        
        return new Promise(function(_resolve, _reject){
            if(scope == "room")
            {
                var mediaRendererRoom = self.managerDisposer.deviceManager.getMediaRenderer(id);
                if(mediaRendererRoom)
                {
                    self.runAction(_resolve, _reject, _mediaRenderer, mediaRendererRoom, mediaRendererRoom.roomUdn());
                }
                else
                {
                    self.logError("Room with id '" + id + "' not found");
                    _reject("Room with id '" + id + "' not found");
                }
            }
            else
            {
                self.runAction(_resolve, _reject, _mediaRenderer, null, "");
            }
        });
    }
}