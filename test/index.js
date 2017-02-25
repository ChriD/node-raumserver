

// http://10.0.0.4:8080/raumserver/data/getZoneConfig
var raumserverHost = "http://10.0.0.4:8080";
var raumserverRequestData = raumserverHost + "/raumserver/data/";
var raumserverRequestController = raumserverHost + "/raumserver/controller/";


function doGetAction(_action)
{
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