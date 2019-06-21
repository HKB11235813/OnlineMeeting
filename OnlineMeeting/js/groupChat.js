window.onload=function(){
	$(".name").text(getCookie('name'));
	var cons = '<img src="img/'+getCookie('userID')+'.jpg"/>';
	titleImgID=document.getElementById("titleImg");
	titleImgID.insertAdjacentHTML('beforeEnd',cons);
	meetingID = getCookie('meetingID');
	userID = getCookie('userID');
	
	//初始化群聊消息
	$.post(ajaxsUrl+"groupChatListServlet",{meetingID:meetingID},
	function(data){
	 	var messages = data;
	  	groupChatMessageListID=document.getElementById("groupChatMessageList");
		groupChatMessageListID.innerHTML='';
		for(var i=0;i<messages.length;i++){
			var cons;
			var sendTime = messages[i].sendTime;
			if(getNowFormatDate() == messages[i].sendTime.substr(0,10)){
				//如果在当天就不显示日志咯
				sendTime = sendTime.substr(11,8);
			}
			
			if(messages[i].userID==userID){
				cons = 	'<div class="messageTime row">'+sendTime+'</div>'+
						'<div class="receiver">'+
							'<div>'+
							  	'<img src="img/'+messages[i].userID+'.jpg">'+
							'</div>'+
							'<div>'+
								'<div class="right_triangle"></div>'+
								'<span> '+messages[i].message+' </span>'+
							'</div>'+
		        		'</div>';
			}else{
				cons = 	'<div class="messageTime">'+sendTime+'</div>'+
						'<div class="sender">'+
				  			'<div>'+
				  				'<img src="img/'+messages[i].userID+'.jpg">'+
				  			'</div>'+
				  			'<div>'+
				  				'<div class="left_triangle"></div>'+
				  				'<span> '+messages[i].message+' </span>'+
							'</div>'+
		        		'</div>';
			}
		  	//插入数据到对应区域
			groupChatMessageListID.insertAdjacentHTML('beforeEnd',cons);
		}
	},"json");

	initWebSocket();
}


/*******************群聊部分********************/
//创建webSocket
var webSocket;
function initWebSocket(){
	//房间名就为meetingID,userName就为userID
    var roomName = meetingID;
	var username = userID;
	if(username == "" || username==null){
	    alert("用户名不能为空");
	    return;
	}
	if("WebSocket" in window){
//    	alert("您的浏览器支持 WebSocket!");
    	if (webSocket == null) {
        	var url = groupChatUrl + roomName+"/"+username;
        	// 打开一个 web socket
        	webSocket = new WebSocket(url);
    	}
 
        webSocket.onmessage = function (evt){
        	var received_msg =  jQuery.parseJSON(evt.data);
        	groupChatMessageListID=document.getElementById("groupChatMessageList");
        	console.log(received_msg);
        	if(received_msg.userID==userID){
				cons = 	'<div class="messageTime row">'+received_msg.sendTime.substr(11,8)+'</div>'+
						'<div class="receiver">'+
							'<div>'+
							  	'<img src="img/'+received_msg.userID+'.jpg">'+
							'</div>'+
							'<div>'+
								'<div class="right_triangle"></div>'+
								'<span> '+received_msg.message+' </span>'+
							'</div>'+
		        		'</div>';
			}else{
				cons = 	'<div class="messageTime">'+received_msg.sendTime.substr(11,8)+'</div>'+
						'<div class="sender">'+
				  			'<div>'+
				  				'<img src="img/'+received_msg.userID+'.jpg">'+
				  			'</div>'+
				  			'<div>'+
				  				'<div class="left_triangle"></div>'+
				  				'<span> '+received_msg.message+' </span>'+
							'</div>'+
		        		'</div>';
			}
	  		//插入数据到对应区域
			groupChatMessageListID.insertAdjacentHTML('beforeEnd',cons);
			$('.groupChatBox').scrollTop(2000);
        };
 
        webSocket.onclose = function () {
            // 关闭 websocket，清空信息板
    		webSocket = null;
		};
	}else {
    	// 浏览器不支持 WebSocket
    	alert("您的浏览器不支持 WebSocket!");
    }
}

function send_msg(){
    if (webSocket != null) {
        var input_msg = $('.sendingMessage').val();
	    if (input_msg == "") {
	    	//不允许发生空信息
	        return;
	    }else{
	    	webSocket.send(input_msg);
	    	// 清除textarea框里的信息
	    	$('.sendingMessage').val('');
	    }
	}else{
    	alert("您已掉线，请重新进入聊天室...");
    }
}
 
function closeWs(){
   webSocket.close();
}
//获取当前年月日，格式为 yyyy/mm/dd
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "/";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}