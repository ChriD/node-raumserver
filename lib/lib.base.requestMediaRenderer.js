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
        
        // the request itself may use a forced scope. if so we have to use it!
        if(this.useZoneRenderer())
            scope = "zone";
        
        try
        {
            var mediaRenderers = self.getMediaRenderersFromIdAndScope(id, scope);
            if(!mediaRenderers.size)
            {
                self.logError("MediaRenderer for id '" + id + "' not found");
                throw ("MediaRenderer for id '" + id + "' not found"); // TODO: create error object on throws everywheer!!!
            }
            
            for (var udn of mediaRenderers.keys())
            {
                self.logDebug("Calling action '" + this.action + "' for renderer " + mediaRenderers.get(udn).name());
                try
                {
                    // await the result of the media renderer action, if there is an error we will get into the 
                    // catch and we log the error but we do throw it
                    await self.runActionForMediaRenderer(mediaRenderers.get(udn));                         
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
    } 
    
    /**
     * will be called each media renderer for what we have to execute the request
     * @param {Object} the media renderer class
     * @return {Promise} a promise if ok or not
     */
    runActionForMediaRenderer(_mediaRenderer)
    {
        var self = this;
        return new Promise(function(_resolve, _reject){
            self.runAction(_resolve, _reject, _mediaRenderer);
        });
    }
}