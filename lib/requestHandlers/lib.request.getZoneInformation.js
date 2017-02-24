'use strict'; 
var RequestLongPolling = require('../lib.base.requestLongPolling');

module.exports = class Request_GetZoneInformation extends RequestLongPolling
{
    constructor()
    {
        super();
    }
    
    runAction(_resolve, _reject)
    {
        try
        {
            // TODO: we have to convert the zone configuration object to a readable josn format due to the "named arrays" for the rooms
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