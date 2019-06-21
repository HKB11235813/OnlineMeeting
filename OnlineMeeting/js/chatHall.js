window.onload=function(){
	$(".name").text(getCookie('name'));
	var cons = '<img src="img/'+getCookie('userID')+'.jpg"/>';
	titleImgID=document.getElementById("titleImg");
	titleImgID.insertAdjacentHTML('beforeEnd',cons);
	
	
	$.post(ajaxsUrl+"mainbodyServlet",{userName:getCookie('name'),userID:getCookie('userID')},
	 function(data){
	 	//解析json
 		var meeting = data;
 		for (var i=0;i<meeting.length;i++) {
 			var meetingListID;
 			switch (meeting[i].meetingStatus){
 				case '进行中':meetingListID=document.getElementById("doingMeeting");
 							break;
 				case '已完成':meetingListID=document.getElementById("endingMeeting");
 							break;
 				default:    meetingListID=document.getElementById("pendingMeeting");
 					        break;
 			}
 			
 			var cons = '<li class="mui-table-view-cell">'+
				    		'<a onclick="enterChat('+meeting[i].meetingID+')" class="mui-navigate-right">'+
				    		'<img class="groupChatImg" src="img/'+meeting[i].meetingID+'.jpg"/>'+
				      		'<span class="meetingName">'+meeting[i].meetingName+'</span>'+
				    		'</a>'+
				  		'</li>';
			//插入数据到对应区域
			meetingListID.insertAdjacentHTML('beforeEnd',cons);
 		}
	},"json");
}

function enterChat(meetingID){
	setCookie('meetingID',meetingID,1);
	window.location.href="groupChat.html";
}