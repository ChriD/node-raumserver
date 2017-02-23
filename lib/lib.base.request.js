'use strict'; 
var Raumkernel = require('node-raumkernel');

module.exports = class Request extends Raumkernel.BaseManager
{
    constructor()
    {
        super();
        this.url = "";
        this.action = "";
        this.queryObject = {};
    }
    
    static newFromAction(_action)
    {
        var request = null;
        try
        {
            var actionClass = require('./requestHandlers/lib.request.' + _action);
            return new actionClass();           
        }
        catch(_exception)
        {
            // silent errors when there is a problem creating the request classes
        }
        return null;
    }
    
    
    parmUrl(_url = this.url)
    {
        this.url = _url;
        return this.url;
    }
    
    
    parmAction(_action = this.action)
    {
        this.action = _action.toLowerCase();
        return this.action;
    }
    
    parmQueryObject(_queryObject)
    {
        this.queryObject = _queryObject;
        return this.queryObject;
    }
    
    
    run()
    {
        var self = this;
        return new Promise(function(_resolve, _reject){
            self.runAction(_resolve, _reject);
        })
    }
    
    
    runAction(_resolve, _reject)
    {
    }
    
    
    
    
    
}