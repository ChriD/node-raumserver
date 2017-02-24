'use strict'; 
var RequestLongPolling = require('../lib.base.requestLongPolling');

module.exports = class Request_GetZoneConfig extends RequestLongPolling
{
    constructor()
    {
        super();
    }
    
    runAction(_resolve, _reject)
    {
        try
        {
            // TODO: we have to convert the zone configuration object to a readable json format. In fact it is already readable but is should
            // be a little bit nicer and maybe compatible with the json return of the  C++ version of the raumserver
            _resolve(this.managerDisposer.zoneManager.zoneConfiguration);
        }
        catch(_exception)
        {
            this.logError(_exception);
            _reject({"error": _excpetion});
        }
    }
    
    getCurrentUpdateId()
    {
        return this.managerDisposer.zoneManager.lastUpdateId;
    }
}