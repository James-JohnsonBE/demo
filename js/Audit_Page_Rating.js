var Audit = window.Audit || {};
Audit.Rating = Audit.Rating || {};

$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ExecuteOrDelayUntilScriptLoaded(InitReport, "sp.js"));

})

function InitReport() 
{    
	Audit.Rating.Report = new Audit.Rating.NewRatingPage();
	Audit.Rating.Init();
}

Audit.Rating.Init = function()
{
}

Audit.Rating.NewRatingPage = function ()
{	

	m_fnLoad();
	
	function m_fnLoad()
	{
		$("#btnSubmitRating").click(function()
		{
			m_fnSubmitRating();
		});
	}
	
	function m_fnSubmitRating()
	{
		var rateValue = $("#rateValue").text();
		
		if( rateValue == null || rateValue == "" )
		{
			SP.UI.Notify.addNotification("Please select a star rating...", false);
			return;
		}
		
		if( confirm("Are you sure you would like to submit your rating " + rateValue + "?"))
		{
			$("#btnSubmitRating").hide();
			$('#rateit1').rateit('readonly', true);
			
			/*boo... we aren't going to do ratings on this site
			
			var currCtx = new SP.ClientContext.get_current();
			var oList = currCtx.get_web().get_lists().getByTitle('AuditRatings');
        
		    var itemCreateInfo = new SP.ListItemCreationInformation();
		    this.oListItem = oList.addItem( itemCreateInfo );
		        
		    oListItem.set_item('NumValue', rateValue);		        
		    oListItem.update();
		
			
			currCtx.executeQueryAsync
			(
				function () 
				{	
					SP.UI.Notify.addNotification("Thank you for your feedback...", false);
				}, 
				function (sender, args) 
				{
					SP.UI.Notify.addNotification("Thank you for your feedback...", false);
				}
			);	*/
		}
	}
	
	
	var publicMembers = 
	{
		//Load: m_fnLoadData
	}
	
	return publicMembers;
}
