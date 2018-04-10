'use strict';
const Url = require('url');
const QueryString = require('query-string');
var Http = require("http");
var Raumkernel = require('node-raumkernel');
var Request = require('./lib.base.request');
var PackageJSON = require("../package.json");
var os = require('os');

module.exports = class Raumserver extends Raumkernel.Base
{
    constructor()
    {
        super();
        this.raumkernel = new Raumkernel.Raumkernel();
        this.httpServer = null;

        this.settings = {};
        this.settings.port = 8080;
    }

    additionalLogIdentifier()
    {
        return "Raumserver";
    }

    /**
     * construct and set a default logger
     * @param {Number} the log level which should be logged
     */
    createLogger(_logLevel = 2, _path = "./logs")
    {
        this.parmLogger(new Raumkernel.Logger(_logLevel, _path));
    }

    /**
     * should be called after the class was instanced and after an external logger was set (otherwise a standard logger will be created)
     * this method initializes the raumkernel,starts up the request server and does the bonjour
     */
    init()
    {
        var self = this;

        // set the template file for uri set method
        this.raumkernel.getSettings().uriMetaDataTemplateFile =  "node_modules/node-raumkernel/lib/setUriMetadata.template";

        // set some other settings from the config/settings file
        // TODO: @@@
        //this.raumkernel.getSettings().

        // if there is no logger defined we do create a standard logger
        if(!this.parmLogger())
            this.createLogger(this.settings.loglevel);

        this.logInfo("Welcome to raumserver v" + PackageJSON.version +" (raumkernel v" + Raumkernel.PackageJSON.version + ")");

        // log some information of the network interfaces for troubleshooting
        this.logNetworkInterfaces();

        // Do the init of the raumkernel. This will include starting for the raumfeld multiroom system and we
        // do hook up on some events so the raumserver knows the status of the multiroom system
        this.logVerbose("Setting up raumkernel");
        this.raumkernel.parmLogger(this.parmLogger());
        // TODO: listen to events like hostOnline/hostOffline
        this.raumkernel.init();

        this.logVerbose("Starting HTTP server to receive requests");
        this.startHTTPServer();

        this.logVerbose("Starting bonjour server for advertising");
        // TODO: @@@
    }

     /**
     * will start the HTTP Server if its not started
     */
    startHTTPServer()
    {
        var self = this;
        if(!this.httpServer)
        {
            this.httpServer = Http.createServer();
            this.httpServer.on("request",  function(_request, _response){
                    self.requestReceived(_request, _response);
                });

            // start the server on the port given in the settings
            this.httpServer.listen(this.settings.port, function() {
                self.logVerbose('Raumserver listening on port ' + self.settings.port.toString());
            });
        }
    }

     /**
     * will be called whenever a request is made to the raumserver and the raumnserver receives it
     */
    requestReceived(_request, _response)
    {
        this.logVerbose("Request received: " + _request.method + " " + _request.url);
        var parsedUrl = Url.parse(_request.url);

        // simply soak up system requests of browsers or other clients
        if(parsedUrl.pathname.startsWith("/favicon.ico"))
            return

        // if we are on the '/raumserver/controller/' or '/raumserver/data/' path we can handle the requests
        // otherwise they are no requests to the raumserver.
        if( parsedUrl.pathname.startsWith("/raumserver/controller/") ||
            parsedUrl.pathname.startsWith("/raumserver/data/"))
        {
            this.logDebug("Request to raumserver recognized: " + _request.url);
            var pathArray = parsedUrl.pathname.split("/");
            var queryObject = QueryString.parse(parsedUrl.query);
            if(pathArray.length === 4)
                this.handleRequestObject(pathArray[3], queryObject,  _request, _response);
            else
                this.handleUnknownPath(_request, _response);
        }
        else
            this.handleUnknownPath(_request, _response);
    }


    handleRequestObject(_action, _queryObject, _request, _response)
    {
        var self = this;
        var requestObj = null;
        // get request action and check if this is a valid action
        // if the request object which is returned is 'null', the action is not a valid one!

        try
        {
            requestObj = Request.newFromAction(_action);
        }
        catch(_exception)
        {
            // silent catch
            this.logError("Error creating request for action '" + _action + "': " + this.formatException(_exception));
        }

        if(requestObj)
        {
            try
            {
                this.logDebug("Handle action '" + _action + "' with query: " + JSON.stringify(_queryObject));
                requestObj.parmLogger(this.parmLogger());
                requestObj.parmManagerDisposer(this.raumkernel.managerDisposer);
                requestObj.parmAction(_action);
                requestObj.parmUrl(_request.url);
                requestObj.parmQueryObject(_queryObject);
                requestObj.init();
                requestObj.run().then(function(_data){
                        self.handleFulfilledAction(_action, _request, _response, requestObj, _data);
                    }).catch(function(_data){
                        // the "_data" object we get here may be a string or even an exception or something else, so we have to
                        // convert it to a nice error output which we will do with "convertRejectedDataToResponseData" method
                        self.handleRejectedAction(_action, _request, _response, requestObj, self.convertRejectedDataToResponseData(_data));
                    });
            }
            catch(_exeption)
            {
                self.handleRejectedAction(_action, _request, _response, requestObj, self.convertRejectedDataToResponseData(_exeption));
            }
        }
        else
        {
            this.logError("Action '" + _action + "' is not a valid action!");
            this.handleUnknownAction(_action, _request, _response);
        }
    }


    handleUnknownPath(_request, _response)
    {
        this.logError("Request was rejected because unknown path");
        this.addGlobalResponseHeaders(_response);
        this.addAccessControlHeaders(_request, _response);
        _response.write(this.buildJSONResponse(_request.url, "", "Unknown url path", true, {}));
        _response.end();
    }


    handleUnknownAction(_action, _request, _response)
    {
        this.logError("Request was rejected because of unknown action");
        this.addGlobalResponseHeaders(_response);
        this.addAccessControlHeaders(_request, _response);
        _response.write(this.buildJSONResponse(_request.url, _action, "Unknown action", true, {}));
        _response.end();
    }


    handleFulfilledAction(_action, _request, _response, _requestObj, _data)
    {
        _requestObj.logDebug("Request was accepted and was successfully executed");
        this.addGlobalResponseHeaders(_response);
        this.addAccessControlHeaders(_request, _response);
        this.addResponseHeaders(_response, _requestObj.returnHeaders);
        _response.write(this.buildJSONResponse(_request.url, _action, "", false, _data));
        _response.end();
    }


    handleRejectedAction(_action, _request, _response, _requestObj, _data)
    {
        this.logError("Request was rejected: ", _data);
        this.addGlobalResponseHeaders(_response);
        this.addAccessControlHeaders(_request, _response);
        this.addResponseHeaders(_response, _requestObj.returnHeaders);
        _response.write(this.buildJSONResponse(_request.url, _action, "Action was rejected", true, _data));
        _response.end();
    }


    addResponseHeaders(_response, _headers)
    {
        for (var key in _headers)
        {
            _response.setHeader(key, _headers[key]);
        }
    }


    addGlobalResponseHeaders(_response)
    {
        _response.setHeader('Content-Type', 'application/json');
        _response.status = 200;
    }


    addAccessControlHeaders(_request, _response)
    {
        _response.setHeader('Access-Control-Allow-Origin', '*');
        _response.setHeader('Access-Control-Request-Method', '*');
        _response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        _response.setHeader('Access-Control-Allow-Headers', '*');
        // ChriD 20180410 -->
        // until browsers support the wildcard in the access controls we do specify the exposed headers
        //_response.setHeader('Access-Control-Expose-Headers', '*');
        _response.setHeader('Access-Control-Expose-Headers', 'updateId,updateid,updateID');
        // ChriD 20180410 <--
        //_response.setHeader('Access-Control-Allow-Headers', _request.header.origin);
    }


    buildJSONResponse(_requestUrl, _action, _msg, _error, _data)
    {
        return JSON.stringify({
            "requestUrl" : _requestUrl,
            "action" : _action,
            "error" : _error,
            "msg" : _msg,
            "data" : _data
        });
    }


    convertRejectedDataToResponseData(_rejectedData)
    {
        var errorMessage = "";
        var errorData = null;

        try
        {
            if(_rejectedData === null)
            {
                errorMessage = "Unknown error";
            }
            // TODO: if rejected data is of type "Error" we do return the stack trace too
            /*else if (_rejectedData === 'object')
            {
                errorData = JSON.stringify(_rejectedData);
            }*/
            else
            {
                errorMessage = _rejectedData.toString();
            }
        }
        catch(_exception)
        {
            errorMessage = "Unknown error!"
        }

        return {
            "errorMessage"  : errorMessage,
            "errorData"     : errorData
        };
    }


    formatException(_exception)
    {
        var exmsg = "";
        if (_exception.message)
        {
            exmsg += _exception.message;
        }
        if (_exception.stack)
        {
            exmsg += ' | stack: ' + _exception.stack;
        }
        if(!exmsg)
            exmsg = _exception ;
        return exmsg;
    }


    logNetworkInterfaces()
    {
        var self = this;
        var ifaces = os.networkInterfaces();

        Object.keys(ifaces).forEach(function (ifname) {
            var alias = 0;
            ifaces[ifname].forEach(function (iface)
            {
                if ('IPv4' !== iface.family || iface.internal !== false)
                {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }

                if (alias >= 1)
                {
                    // this single interface has multiple ipv4 addresses
                    self.logInfo(ifname + ':' + alias, iface.address);
                }
                else
                {
                    // this interface has only one ipv4 adress
                    self.logInfo(ifname, iface.address);
                }
                ++alias;
            });
        });
    }

}
