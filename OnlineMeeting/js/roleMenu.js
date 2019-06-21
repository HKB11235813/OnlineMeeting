$.post(ajaxsUrl+"roleMenuServlet",{roleID:getCookie('roleID')},
	function(data){
		var menuClassList = data;
		for(i=0;i<menuClassList.length;i++){
			$(menuClassList[i]).css('display','inline');
		}
},"json");






