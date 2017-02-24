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
        this.queryObjectLowerKeys = {};
        this.returnHeaders = new Map();
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
            throw _exception            
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
    
    parmQueryObject(_queryObject = this.queryObject)
    {
        // convert keys to lower case for nicer handling
        var key, keys = Object.keys(_queryObject);
        var n = keys.length;
        this.ueryObjectLowerKeys = {};
        while (n--) {
            key = keys[n];
            this.ueryObjectLowerKeys[key.toLowerCase()] = obj[key];
        }
        // store original query too
        this.queryObject = _queryObject;
        return this.queryObject;
    }
    
    
    addReturnHeaders(_key, _value)
    {
        this.logDebug("Adding response header for request '" + this.action + "' -> " + _key + " : " + _value);
        this.returnHeaders[_key] = _value;
    }
    
    
    getQueryValue(_key, _noIdReturn = "")
    {
        if(this.queryObjectLowerKeys[_key.toLowerCase()])
            return this.queryObject[key.toLowerCase()];
        return _noIdReturn;
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