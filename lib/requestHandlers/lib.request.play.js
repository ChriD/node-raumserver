'use strict'; 
var RequestMediaRenderer = require('../lib.base.requestMediaRenderer');

module.exports = class Request_Play extends RequestMediaRenderer
{
    constructor()
    {
        super();
    }
    
    runAction(_resolve, _reject, _mediaRenderer)
    {
        _mediaRenderer.play().then(function(_data){
                _resolve({_data});
            }).catch(function(_data){
                _reject({_data});
            });
    }
}