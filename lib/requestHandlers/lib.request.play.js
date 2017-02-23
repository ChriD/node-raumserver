'use strict'; 
var Request = require('../lib.base.request');

module.exports = class Request_Play extends Request
{
    constructor()
    {
        super();
    }
    
    runAction(_resolve, _reject)
    {
        // TEST
        
        
        
        //this.managerDisposer.deviceManager.
        setTimeout(function(){ _resolve( {} ) }, 3000);
    }
}