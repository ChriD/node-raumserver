'use strict'; 
var Request = require('./lib.base.request');

module.exports = class RequestLongPolling extends Request
{
    constructor()
    {
        super();
    }
    
    run()
    {
        var self = this;
        var updateIdQuery = this.getQueryValue("updateId");
        return new Promise(function(_resolve, _reject){
            // if there is no update id we can directly call the request run action              
            if(!updateIdQuery || !self.getCurrentUpdateId())
            {
                self.logDebug("No updateId given for action '" + self.action + "'. Using direct execution");
                if(self.getCurrentUpdateId())
                    self.addReturnHeaders("updateId", self.getCurrentUpdateId());
                self.runAction(_resolve, _reject);
            }
            else
            {
                self.logDebug("No data has changed for long polling action '" + self.action + "'. Waiting for change");
                self.checkForChangedUpdateId(updateIdQuery).then(function(){
                    if(self.getCurrentUpdateId())
                        self.addReturnHeaders("updateId", self.getCurrentUpdateId());
                    self.runAction(_resolve, _reject);
                }).catch(function(){
                    self.logError("Long Polling request for action '" + self.action + "' was rejected");
                    _reject({});
                })
            }
        });
    }
    
    
    checkForChangedUpdateId(_updateIdQuery)
    {
        var self = this;
        return new Promise(function(_resolve, _reject){
            self.logDebug("Set interval for checking updateId on request action " + self.action);
            var intervalId = setInterval(function() {
                try
                {
                    if(self.getCurrentUpdateId() != _updateIdQuery)
                    {
                        self.logDebug("Clear interval for checking updateId on request action " + self.action);
                        clearInterval(intervalId);
                        _resolve();
                    }
                }
                catch(_exception)
                {
                    _reject({"error" : _exception.message});
                }
            },150);
        });
    }
    
    
    /**
     * this method should return the current updateId for that request
     * @return {String} the current update id for that request
     */
    getCurrentUpdateId()
    {
        return "";
    }
}