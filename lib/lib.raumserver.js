'use strict'; 
const Url = require('url');
const QueryString = require('query-string');
var Http = require("http");
var Raumkernel = require('node-raumkernel');
var Request = require('./lib.base.request');
var PackageJSON = require("../package.json")

module.exports = class Raumserver extends Raumkernel.Base
{
    constructor()
    {
        super();
        this.raumkernel = new Raumkernel.Raumkernel();
        this.httpServer = null;
    }

    additionalLogIdentifier()
    {
        return "Raumserver";
    }
    
    /**
     * construct and set a default logger      
     * @param {Number} the log level which should be logged
     */
    createLogger(_logLevel = 2, _path = "")
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
        
        this.logInfo("Welcome to raumserver v" + PackageJSON.version +" (raumkernel v" + Raumkernel.PackageJSON.version + ")");
        
        // if there is no logger defined we do create a standard logger
        if(!this.parmLogger())
            this.createLogger();
        
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
            
            // todo: use port from settings file
            this.httpServer.listen(8080, function() {
                self.logVerbose('Raumserver listening on port 8080');
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
        // if we are on the '/raumserver/controller/' or '/raumserver/data/' path we can handle the requests
        // otherwise they are no requests to the raumserver.        
        if( parsedUrl.pathname.startsWith("/raumserver/controller/") || 
            parsedUrl.pathname.startsWith("/raumserver/data/"))
        {
            this.logDebug("Request to raumserver recognized: " + _request.url);
            var pathArray = parsedUrl.pathname.split("/");
            var queryObject = QueryString.parse(parsedUrl.query);
            if(pathArray.length === 4)
                this.handleRequest(pathArray[3], queryObject,  _request, _response);
            else
                this.handleUnknownPath(_request, _response);
        }
        else
            this.handleUnknownPath(_request, _response);
    }
    
    
    handleRequest(_action, _queryObject, _request, _response)
    {
        var self = this;
        // get request action and check if this is a valid action
        // if the request object which is returned is 'null', the action is not a valid one!

        var request = Request.newFromAction(_action);
        if(request)
        {
            this.logDebug("Handle action '" + _action + "' with query: " + JSON.stringify(_queryObject));
            request.parmLogger(this.parmLogger());
            request.parmAction(_action);
            request.parmUrl(_request.url);
            request.parmQueryObject(_queryObject);
            request.run().then(function(_data){                 
                    self.handleFulfilledAction(_action, _request, _response, _data);
                }).catch(function(_data){
                     self.handleRejectedAction(_action, _request, _response, _data);  
                });
        }
        else
        {
            this.logError("Action '" + _action + "' is not a valid action!");
            this.handleUnknownAction(_action, _request, _response);
        }
    }
    
    
    handleUnknownPath(_request, _response)
    {
        _response.writeHead(200, {"Content-Type": "text/plain"});
            _response.write("Oje...");
            _response.end();
    }
    
    
    handleUnknownAction(_action, _request, _response)
    {
        _response.writeHead(200, {"Content-Type": "text/plain"});
            _response.write("Oje...");
            _response.end();
    }
    
    
    handleFulfilledAction(_action, _request, _response)
    {
           _response.writeHead(200, {"Content-Type": "text/plain"});
            _response.write(_action);
            _response.end();  
    }
    
    
    handleRejectedAction(_action, _request, _response)
    {
        _response.writeHead(200, {"Content-Type": "text/plain"});
            _response.write("Oje...Recected" );
            _response.end();
    }
    
    
    buildJSONResponse()
    {
        /*
        requestUrl
        requestQuery
        action
        msg
        data
        error (bool)
        */
    }
    
    /*
    
    if (_headerVars && _headerVars->size())
            {                
                for (auto it = _headerVars->begin(); it != _headerVars->end(); it++)
                //for (auto pair : *_headerVars)
                {
                    headerVarListInp += "," +  it->first;
                }
                //headerVarListInp.pop_back();
                headerVarListExp = headerVarListInp;
            }
            else
    
    */
    
    
    //std::string corsHeader = "Access-Control-Allow-Origin: *"; 
    //  corsHeader += "\r\nAccess-Control-Allow-Headers: " + headerVarListInp;
     //       corsHeader += "\r\nAccess-Control-Expose-Headers: " + headerVarListExp;   
    
    
    
    
    //https://gist.github.com/balupton/3696140
}
