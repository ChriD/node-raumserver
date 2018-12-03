'use strict';
var Request = require('../lib.base.request');

module.exports = class Request_GetMediaList extends Request
{
    constructor()
    {
        super();
    }


    runAction(_resolve, _reject)
    {
        var containerId = this.getQueryValue("id", "0")
        this.raumkernel.managerDisposer.mediaListManager.getMediaList(containerId, containerId, "", true, true).then(function(_data){
            _resolve(_data);
        }).catch(function(_data){
            _reject(_data);
        });
    }
}