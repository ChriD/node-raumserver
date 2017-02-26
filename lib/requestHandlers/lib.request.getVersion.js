'use strict'; 
var Raumkernel = require('node-raumkernel');
var PackageJSON = require("../../package.json")
var Request = require('../lib.base.request');

module.exports = class Request_GetVersion extends Request
{
    constructor()
    {
        super();
    }
    
    runAction(_resolve, _reject)
    {
        try
        {
            _resolve({ 
                "raumkernelLib" :  Raumkernel.PackageJSON.version,
                "raumserverLib" :  PackageJSON.version
            });
        }
        catch(_exception)
        {
            this.logError(_exception);
            _reject(_excpetion);
        }
    }
}