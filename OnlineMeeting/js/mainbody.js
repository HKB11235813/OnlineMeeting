window.onload=function(){
	$(".name").text(getCookie('name'));
	$(".roleName").text(getCookie('roleName'));
	
	$.post(ajaxsUrl+"mainbodyServlet",{userName:getCookie('name'),userID:getCookie('userID')},
	 function(data){
	 	//解析json
 		var meeting = data;
 		for (var i=0;i<meeting.length;i++) {
 			var meetingStatusBtn1,meetingStatusBtn2='结束会议';
 			var meetingListID;
 			switch (meeting[i].meetingStatus){
 				case '进行中':meetingStatusBtn1='参加会议';
 							meetingListID=document.getElementById("doingMeeting");
 							break;
 				case '已完成':meetingStatusBtn1='查看会议';
 							meetingStatusBtn2='删除会议';
 							meetingListID=document.getElementById("endingMeeting");
 							break;
 				default:meetingStatusBtn1='开始会议';
 							meetingListID=document.getElementById("pendingMeeting");
 					        break;
 			}
 			
 			var cons = '<ul>'+
					    '<li>'+
							'<p>会议名称：'+meeting[i].meetingName+'</p>'+
							'<p>会议简介：'+meeting[i].meetingIntro+'</p>'+
							'<p>主持人：'+meeting[i].host+'</p>'+
							'<p>会议时间：'+meeting[i].startTime +' 至  '+ meeting[i].endTime+'</p>'+
							'<p class="button">'+
								'<button type="button" class="btn btn-primary" '+
								'onclick="meetingIng(\''+meetingStatusBtn1+'\',\''+meeting[i].meetingID+'\',\''+meeting[i].host+'\')">'+meetingStatusBtn1+'</button>'+
								'<button type="button" class="btn btn-danger" '+
								'onclick="closeMeeting(\''+meetingStatusBtn2+'\',\''+meeting[i].meetingID+'\',\''+meeting[i].host+'\')">'+meetingStatusBtn2+'</button>'+
							'</p>'+
						'</li>'+
					'</ul>';
			//插入数据到对应区域
			meetingListID.insertAdjacentHTML('beforeEnd',cons);
 		}
	},"json");
}

//结束或删除会议操作
function closeMeeting(editType,meetingID,meetingHost){
	if(getCookie('name') == meetingHost){
		var btnArray = ['确认', '取消'];
		mui.confirm('确认'+editType+'吗？','Hello',btnArray,function(e){
			if(e.index == 0){
				//点击确认会开始删除该会议
				$.post(ajaxsUrl+"closeMeetingServlet",{editType:editType,meetingID:meetingID},
	 			function(data){
	 				$('.closeMeetingAlert1').text(data);
					$("#closeMeetingDialog1").modal({
				       show:true,
				       backdrop:'static',
				       keyboard:false
					});
	 			},"json");
	 			
			}
		});
	}else{
		//不是主持人不能结束此次会议
		$('.closeMeetingAlert').text('你不是此次会议的主持人无法'+editType+'！');
		$("#closeMeetingDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
	}
}

//点击参加会议，查看会议,开始会议
function meetingIng(editType,meetingID,meetingHost){
	if(editType == '开始会议'){
		closeMeeting(editType,meetingID,meetingHost);
	}else{
		setCookie('meetingID',meetingID);
		window.location.href="meetinging.html";
	}
}

	