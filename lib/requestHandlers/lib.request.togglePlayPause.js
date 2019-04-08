'use strict';
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_TogglePlayPause extends RequestMediaRenderer {
    constructor() {
        super();
    }


    runAction(_resolve, _reject, _mediaRendererVirtual, _mediaRendererRoom, _roomUdn) {
        var self = this;
        var mute = 0;

        if (_mediaRendererVirtual && _mediaRendererVirtual.rendererState) {
            if (_mediaRendererVirtual.rendererState.TransportState == "PLAYING") {
                _mediaRendererVirtual.pause(this.waitTillConfirmed()).then(function (_data) {
                    _resolve(_data);
                }).catch(function (_data) {
                    _reject(_data);
                });
            }
            else {
                _mediaRendererVirtual.play(this.waitTillConfirmed()).then(function (_data) {
                    _resolve(_data);
                }).catch(function (_data) {
                    _reject(_data);
                });
            }
        }
    }
}