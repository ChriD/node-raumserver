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
        var updateIdQuery = self.getQueryValue("updateId");
        return new Promise(function(_resolve, _reject){
            // if there is no update id we can directly call the request run action
            if(!updateIdQuery || !self.getCurrentUpdateId())
            {
                if(self.getCurrentUpdateId())
                    self.addReturnHeaders("updateId", self.getCurrentUpdateId());
                self.runAction(_resolve, _reject);
            }
            else
            {
                self.checkForChangedUpdateId().then(function(){
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
    
    
    checkForChangedUpdateId()
    {
        var self = this;
        return new Promise(function(_resolve, _reject){
            this.logDebug("Set interval for checking updateId on request action " + self.action);
            var intervalId = setInterval(function() {
                if(self.getCurrentUpdateId() != updateIdQuery)
                {
                    this.logDebug("Clear interval for checking updateId on request action " + self.action);
                    clearInterval(intervalId);
                    _resolve();
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