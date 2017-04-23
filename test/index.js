

// http://10.0.0.4:8080/raumserver/data/getZoneConfig
var raumserverHost = "http://10.0.0.4:8080";
var raumserverRequestData = "";
var raumserverRequestController = "";


$( document ).ready(function() {
    $("#ip").val(raumserverHost);
    setUrls();      
});


function setUrls()
{
    raumserverHost = $("#ip").val();
    raumserverRequestData = raumserverHost + "/raumserver/data/";
    raumserverRequestController = raumserverHost + "/raumserver/controller/";
}


function encodeString(_string)
{
    return encodeURIComponent(_string)/*.replace(/\-/g, "%2D")*/.replace(/\_/g, "%5F").replace(/\./g, "%2E").replace(/\!/g, "%21").replace(/\~/g, "%7E").replace(/\*/g, "%2A").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");
}


function doGetAction(_action)
{    
    showJSONResult({ "val" : "Waiting for response..."});
    setUrls();
    $.ajax({
                url: raumserverRequestData + _action,
                cache: false,
                async: false,
                success: function(res, status, xhr) 
                {
                    showJSONResult( res );
                },
                error: function(xhr, textStatus, errorThrown)
                {
                    showJSONResult({ "error" : errorThrown.message });
                }
            });    
}

function doAction(_action)
{
    if($("#confirm").is(':checked'))
    {
        if(_action.indexOf("?") > 0)
            _action += "&confirm=1"
        else
            _action += "?confirm=1"
    }

    showJSONResult({ "val" : "Waiting for response..."});
    setUrls();
    $.ajax({
                url: raumserverRequestController + _action,
                cache: false,
                async: false,
                success: function(res, status, xhr) 
                {
                    showJSONResult( res );
                },
                error: function(xhr, textStatus, errorThrown)
                {
                    showJSONResult({ "error" : errorThrown.message });
                }
            });    
}


function showJSONResult(_result)
{
    var node = new PrettyJSON.view.Node({
      el:$('#resultData'),
      data:_result
    });
    node.expandAll();
}