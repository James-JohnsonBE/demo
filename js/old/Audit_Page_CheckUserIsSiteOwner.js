
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script>

SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function (){} ); 
SP.SOD.executeOrDelayUntilScriptLoaded(CheckPerms,"sp.js"); 

function CheckPerms()
{
   	CheckUser();
}

function CheckUser()
{
	var isSiteOwner = false;
	
	var ctx = new SP.ClientContext.get_current(); 
    var siteColl = ctx.get_site(); 
    var web = ctx.get_web(); 
	this.ownerGroup = web.get_associatedOwnerGroup();
 	this.memberGroup = web.get_associatedMemberGroup();
 	this.visitorGroup = web.get_associatedVisitorGroup();
	ctx.load( web ); 
	ctx.load( ownerGroup ); 
	ctx.load( memberGroup ); 
	ctx.load( visitorGroup ); 
   	ctx.executeQueryAsync(
    	function()
	    {
	   		var ownerGroupID = ownerGroup.get_id();
	   		var memberGroupID = memberGroup.get_id();
	   		var visitorGroupID = visitorGroup.get_id();
	   		var oAssociatedGroups = { ownerGroupID: ownerGroupID, memberGroupID: memberGroupID, visitorGroupID: visitorGroupID };
	   		IsUserSiteOwner(oAssociatedGroups , function (isSiteOwner)
	   		{
		   		if( isSiteOwner )
			   		alert("yes");
			   	else
			   		alert("no");
	   		});
	    },
	    function()
	    {
	    }
    ); 
}

function IsUserSiteOwner(oAssociatedGroups, OnComplete) 
{
 	clientContext = new SP.ClientContext.get_current();
    collGroup = clientContext.get_web().get_siteGroups();
  
	var oGroup1 = collGroup.getById( oAssociatedGroups.ownerGroupID );
    this.collOwnerUsers = oGroup1.get_users();
    clientContext.load( collOwnerUsers );

    var oGroup2 = collGroup.getById( oAssociatedGroups.memberGroupID );
    this.collMemberUsers = oGroup2.get_users();
    clientContext.load( collMemberUsers );

    var oGroup3 = collGroup.getById( oAssociatedGroups.visitorGroupID );
    this.collVisitorUsers = oGroup3.get_users();
    clientContext.load( collVisitorUsers );
    
    function OnSuccess(sender, args) 
	{
	    var userInfo = '';
		var isOwner = false;
	    var userEnumerator = collOwnerUsers.getEnumerator();
	    while (userEnumerator.moveNext())
	    {
	    	var oUser = userEnumerator.get_current();
	    	if( _spPageContextInfo.userId == oUser.get_id() )
	    	{
	    		isOwner = true; 
	    		break;
	    	}
	    }
	    
	    if( !isOwner )
	    {
	    	var userEnumerator = collMemberUsers.getEnumerator();
		    while (userEnumerator.moveNext())
		    {
		    	var oUser = userEnumerator.get_current();
		    	if( _spPageContextInfo.userId == oUser.get_id() )
		    	{
		    		isOwner = true; 
		    		break;
		    	}
		    }

	    }
	    
	    if( !isOwner )
	    {
	    	var userEnumerator = collVisitorUsers.getEnumerator();
		    while (userEnumerator.moveNext())
		    {
		    	var oUser = userEnumerator.get_current();
		    	if( _spPageContextInfo.userId == oUser.get_id() )
		    	{
		    		isOwner = true; 
		    		break;
		    	}
		    }

	    }

	    OnComplete( isOwner );
    }
    function OnFailure(sender, args) 
    {
		statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
		SP.UI.Status.setStatusPriColor(statusId, 'red');

        OnComplete(false);
    }
   	clientContext.executeQueryAsync(OnSuccess, OnFailure);
}

</script>