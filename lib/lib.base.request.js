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
            // parent will handle exception, no silent exception here anymore!
            throw _exception            
        }
        return null;
    }
    
    additionalLogIdentifier()
    {
        return "Request." + this.action;
    }
    
    
    parmUrl(_url = this.url)
    {
        this.url = _url;
        return this.url;
    }
    
    
    parmAction(_action = this.action)
    {
        //this.action = _action.toLowerCase();
        this.action = _action;
        return this.action;
    }
    
    parmQueryObject(_queryObject = this.queryObject)
    {
        // convert keys to lower case for nicer handling
        var key, keys = Object.keys(_queryObject);
        var n = keys.length;
        this.queryObjectLowerKeys = {};
        while (n--) {
            key = keys[n];
            this.queryObjectLowerKeys[key.toLowerCase()] = _queryObject[key];
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
            return this.queryObjectLowerKeys[_key.toLowerCase()];
        return _noIdReturn;
    }
    
    
    init()
    {
    }
    
    
    run()
    {
        var self = this;
        return new Promise(function(_resolve, _reject){
            try
            {
                self.runAction(_resolve, _reject);
            }
            catch(_exception)
            {
                _reject(_exception);
            }
        })
    }
    
    
    runAction(_resolve, _reject)
    {
    }
    
    
    getDevicesFromId(_id)
    {
        this.getDevicesFromIdAndScope(_id);
    }
    
    
    /**
     * returns a map with mediaRederers     
     * @param {String} udn or room name
     * @param {String} the scope. That means which device we want to get (zone device or sub)
     * @return {Map} a map with key, value whereby the key is the udn and the value is the device
     */
    getMediaRenderersFromIdAndScope(_id, _scope = "zone")
    {
        // first check if there is an id, if there is no id we should return all devices
        // in this case the scope does not matter because for that case we only want to 
        // have the virtual renderers
        if(!_id)
        {
            return this.managerDisposer.deviceManager.mediaRenderersVirtual;
        }
        else
        {  
            var mediaRenderer;
            if(_scope == "zone")
                mediaRenderer = this.managerDisposer.deviceManager.getVirtualMediaRenderer(_id);
            else
                mediaRenderer =  this.managerDisposer.deviceManager.getMediaRenderer(_id); 

            var ret = new Map();
            if(mediaRenderer)
                ret.set(mediaRenderer.udn(), mediaRenderer);
                
            return ret;
        }
    }
    
}