var meetingID = getCookie('meetingID');
var userID = getCookie('userID');
var participantsArray = new Array();

window.onload=function(){
	//加载会议信息
	$.post(ajaxsUrl+"meetingIngMessageServlet",{meetingID:meetingID},
	function(data){
		$('.meetingTitle').text(data.meetingName+' : '+data.meetingStatus+'...')
		$('.meetingMessage .hostName').text(data.host);
		$('.meetingMessage .meetingTime').text(data.startTime+' 至 '+data.endTime);
		$('.meetingMessage .meetingAddress').text(data.meetingAddress);
		$('.meetingMessage .meetingTheme').text(data.meetingTheme);
		$('.meetingMessage .participantsNum').text(data.participantsNum);
		setCookie('host',data.host);
	},"json");
	
	//加载参会人员信息初始化一次
	participantList();
	
	//邀请新人,人员领域选择初始化
	$.post(ajaxsUrl+"domainServlet",{domainName:'',domainType:"userDomain"},
	function(data){
	 	//解析json
   		var domain = data;
   		userDomainListID=document.getElementById("userDomainList");
   		for(var i=0;i<domain.length;i++){
   			var cons = '<option value="'+domain[i].domainName+'">'+domain[i].domainName+'</option>';
			//插入数据到对应区域
			userDomainListID.insertAdjacentHTML('beforeEnd',cons);
   		}
	},"json");
	
	//加载议题部分
	discussionList();
	

	
	//发布议题：加载德尔非部分
	$.post(ajaxsUrl+"questionnaireNameListServlet",{},
	function(data){
	 	//解析json
   		var questionnaire = data;
   		dephilSelectID=document.getElementById("dephilSelect");
   		for(var i=0;i<questionnaire.length;i++){
   			var cons = '<option value="'+questionnaire[i].questionnaireID+'">'+questionnaire[i].questionnaireName+'</option>';
			//插入数据到对应区域
			dephilSelectID.insertAdjacentHTML('beforeEnd',cons);
   		}
	},"json");
	
	


}



/*************加载议题部分，可以回答或者查看议题****************/
function discussionList(){
	//加载议题部分
	$.post(ajaxsUrl+"discussionServlet",{meetingID:meetingID},
	function(data){
	 	//解析json
	 	var host = getCookie('host');
		var userName = getCookie('name');
		var funcName = '查看';
		if(host==userName){
			funcName = '统计';
		}
		var discussion = data;
		discussionListID=document.getElementById("discussionList");
		discussionListID.innerHTML='';
		for(var i=0;i<discussion.length;i++){
			var cons = 	'<li class="list-group-item mui-row">'
						  	+'<div class="mui-col-sm-7 mui-col-xs-7">'
						  		+'议题: '+discussion[i].discussionName
						  	+'</div>'
						  	+'<div class="mui-col-sm-5 mui-col-xs-5 operate">'
						  		+'<a onclick="answerDiscussion(\''+discussion[i].discussionType+'\','
						  		+'\''+discussion[i].discussionID+'\',\''+discussion[i].questionnaireID+'\','
						  		+'\''+discussion[i].swotID+'\',\''+discussion[i].competeHypothesID+'\')">回答</a>'
						  		+'<a onclick="lookDiscussion(\''+discussion[i].discussionType+'\','
						  		+'\''+discussion[i].discussionID+'\',\''+discussion[i].questionnaireID+'\','
						  		+'\''+discussion[i].swotID+'\',\''+discussion[i].competeHypothesID+'\')">'+funcName+'</a>'
						  		+'<a onclick="deleteDiscussion(this,\''+discussion[i].discussionID+'\')">删除</a>'
						  	+'</div>'
						  +'</li>';
			//插入数据到对应区域
			discussionListID.insertAdjacentHTML('beforeEnd',cons);
		}
	},"json");
}

//发布议题：可以选择发布不同的议题
$('.publicTopic').click(function(){
	var host = getCookie('host');
	var userName = getCookie('name');
	if(host!=userName){
		$('.alertLable').text("sorry,你不是主持人，无权操作!");
    	$("#alertDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
	}else{
		$("#publicTopicDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
	}
});
//点击确认开始加入议题
$('#publicTopicDialogSure').click(function(){
	//三者中只有一个不为空
	var discussionName = $('.addDiscussionName').val();
	var discussionType = $('.addDiscussionType').val();
	var questionnaireID = $('#dephilPart select').val();
	var swotID =  $('#SWOTPart select').val();
	var competeHypothesID = $('#competeHypothesPart select').val();
	
	if(discussionName!=''){
		if(questionnaireID!=''||swotID!=''||competeHypothesID!=''){
			//数据全部有了后开始传到后端
			$.post(ajaxsUrl+"addDiscussionServlet",{meetingID:meetingID,discussionType:discussionType,
			discussionName:discussionName,questionnaireID:questionnaireID,swotID:swotID,competeHypothesID:competeHypothesID},
			function(data){
			 	//发布议题成功
				discussionList();
			},"json");
		}else{
			//如果全部为空说明根本没有选,则就提示
			$('.alertLable').text("你必须选择一个议题，发布议题失败!");
	    	$("#alertDialog").modal({
		       show:true,
		       backdrop:'static',
		       keyboard:false
			});
		}
	}else{
		//如果全部为空说明根本没有选,则就提示
		$('.alertLable').text("发布议题失败,请输入议题名称!");
    	$("#alertDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
	}
	
	
	
});


//查看议题部分:议题为不同类型的议题，弹出框不同
function lookDiscussion(discussionType,discussionID,questionnaireID,swotID,competeHypothesID){
	if(discussionType=='D'){
		var host = getCookie('host');
		var userName = getCookie('name');
		if(host==userName){
			statisticQuesionnaire(discussionID)
		}else{
			lookQuestionnaire(questionnaireID,discussionID);
		}
		
	}else if(discussionType=='S'){
		lookSwot(swotID,discussionID);
	}else{
		lookCompeteHypothes(competeHypothesID,discussionID);
	}
}
//若是管理员查看则为：统计
function statisticQuesionnaire(discussionID){
	
	$.post(ajaxsUrl+"statisticDiscussionServlet",{discussionID:discussionID},
	function(data){
	 	var question = data;
   		statisticQuestionnaireListID=document.getElementById("statisticQuestionnaireList");
   		statisticQuestionnaireListID.innerHTML='';
   		for(var i=1;i<question.length;i++){
   			var cons = '<div style="overflow: hidden; width: 300px; height: 200px; cursor: pointer;" id="echarts'+question[i].questionID+'"></div>';
			//插入数据到对应区域
			statisticQuestionnaireListID.insertAdjacentHTML('beforeEnd',cons);
			if(question[i].questionType=="单选"){
				echartsList1(question[i].questionID,question[i].questionName,question[i].countValue);
			}else{
				echartsList2(question[i].questionID,question[i].questionName,question[i].countValue);
			}
   		}	
	 	
	},"json");
	
	//渲染数据后打开
	$("#statisticDialog").modal({
       show:true,
       backdrop:'static',
       keyboard:false
	});	
	
	
	
}
//查看议题部分:议题为德尔菲时执行德尔菲的
function lookQuestionnaire(questionnaireID,discussionID){
	//先去查看此人是否已经回答过此问卷，回答过才允许查看
	var dephilAnswerList = new Array();
	$.post(ajaxsUrl+"lookDephilAnswerServlet",{discussionID:discussionID,userID:userID},
		function(data){
			if(data.length==0){
				//没有回答过这个问题就不可以查看
				$('.alertLable').text("对不起你还没有回答过这个议题，无法查看，请去回答吧!");
		    	$("#alertDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
			}else{
				//回答过这个问题可以查看
				for(var i=0;i<data.length;i++){
					var dephilAnswer = {'userID':data[i].userID,
					'questionID':data[i].questionID,'discussionID':data[i].discussionID,'answer':data[i].answer};
					dephilAnswerList.push(dephilAnswer);
				}
				//开始渲染数据
				$.post(ajaxsUrl+"lookQuestionnaireServlet",{questionnaireID:questionnaireID},
					function(data){
					 	//解析json
				   		var question = data;
				   		var locationID;
				   		lookQuestionnaireListID=document.getElementById("lookQuestionnaireList");
				   		lookQuestionnaireListID.innerHTML='';
				   		for(var i=0;i<question.length;i++){
				   			for(var j=0;j<dephilAnswerList.length;j++){
				   				if(question[i].questionID==dephilAnswerList[j].questionID){
				   					locationID = j;
				   					break;
				   				}
				   			}
				   			
				   			var cons='';
				   			if(question[i].questionType=='单选'){
				   				cons = 	'<li class="list-group-item">'+
										    '<div class="row questionTitle">'+
										      	'<span>'+(i+1)+'.'+question[i].questionName+'</span>'+
										    '</div>'+
										    '<div class="row questionSelect">'+
										      	'<span>A.'+question[i].selectA+'</span>'+
										      	'<span>B.'+question[i].selectB+'</span>'+
										      	'<span>C.'+question[i].selectC+'</span>'+
										      	'<span>D.'+question[i].selectD+'</span>'+
										    '</div>'+
										    '<div class="row questionSelect">'+
										      	'<span>您的答案：'+dephilAnswerList[locationID].answer+'<span>'+
										    '</div>'+
										    '<div class="row questionSelect">'+
										      	'<span>正确答案：'+question[i].questionKey+'<span>'+
										    '</div>'+
										'</li>';
								
				   			}else if(question[i].questionType=='多选'){
				   				cons = 	'<li class="list-group-item">'+
										    '<div class="row questionTitle">'+
										      	'<span>(多选)'+(i+1)+'.'+question[i].questionName+'</span>'+
										    '</div>'+
										    '<div class="row questionSelect">'+
										      	'<span>A.'+question[i].selectA+'</span>'+
										      	'<span>B.'+question[i].selectB+'</span>'+
										      	'<span>C.'+question[i].selectC+'</span>'+
										      	'<span>D.'+question[i].selectD+'</span>'+
										      	'<span>E.'+question[i].selectE+'</span>'+
										    '</div>'+
										    '<div class="row questionSelect">'+
										      	'<span>您的答案：'+dephilAnswerList[locationID].answer+'<span>'+
										    '</div>'+
										    '<div class="row questionSelect">'+
										      	'<span>正确答案：'+question[i].questionKey+'<span>'+
										    '</div>'+
										'</li>';
										
				   			}else if(question[i].questionType=='简答'){
				   				cons = 	'<li class="list-group-item">'+
										    '<div class="row questionTitle">'+
										      	'<span>(多选)'+(i+1)+'.'+question[i].questionName+'</span>'+
										    '</div>'+
										    '<div class="row questionSelect">'+
										      	'<span>您的答案：'+dephilAnswerList[locationID].answer+'<span>'+
										    '</div>'+
										    '<div class="row questionSelect">'+
										      	'<span>正确答案：'+question[i].questionKey+'<span>'+
										    '</div>'+
										'</li>';
				   			}
				   			//插入数据到对应区域
							lookQuestionnaireListID.insertAdjacentHTML('beforeEnd',cons);
				   		}
					},"json");
				
				//把所有数据渲染好以后显示
				$("#lookQuestionnairDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
			}
		},"json");
	
	
	
	
	
}
//查看议题部分:议题为态势分析时
function lookSwot(swotID){
	
}
//查看议题部分:议题为竞争性假设时
function lookCompeteHypothes(competeHypothesID){
	
}
//删除议题部分：传入值discussionID
function deleteDiscussion(thisObj,discussionID){
	var host = getCookie('host');
	var userName = getCookie('name');
	if(host!=userName){
		$('.alertLable').text("sorry,你不是主持人，无权操作!");
    	$("#alertDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
	}else{
		var btnArray = ['确认', '取消'];
		var elem = thisObj;
		var li = elem.parentNode.parentNode;
		mui.confirm('确认删除该议题吗？','Hello',btnArray,function(e){
			if(e.index == 0){
				li.parentNode.removeChild(li);
				//把这个userID传过去删掉这个人在这个会议上的记录
				$.post(ajaxsUrl+"discussionDelServlet",{discussionID:discussionID},
				function(data){},"json");
			}
		});
	}	
}




/*************加载参会人员并可以请出****************/
//加载参会人员
function participantList(){
	//初始化之前先清空参会记录人员
	participantsArray.splice(0,participantsArray.length);
	$.post(ajaxsUrl+"meetingIngUserServlet",{meetingID:meetingID},
	function(data){
		var participants = data;
		participantsListID=document.getElementById("participantsList");
		participantsListID.innerHTML='';
		for(var i=0;i<participants.length;i++){
	   		var cons = '<li class="mui-table-view-cell list-group-item" value="\''+participants[i].userID+'\'" >'
							+'<div class="mui-slider-right mui-disabled">'
								+'<a onclick="removeParticipant(this,\''+participants[i].userID+'\',\''+participants[i].name+'\')" class="mui-btn  mui-btn-royal">请出</a>'
							+'</div>'
							+'<div class="mui-slider-handle">'
							    +'<i class="mui-icon mui-icon-person"></i>'+participants[i].name
							+'</div>'
						+'</li>';	
			//插入数据到对应区域
			participantsListID.insertAdjacentHTML('beforeEnd',cons);
			var user = {'userID':participants[i].userID,'name':participants[i].name};
			participantsArray.push(user);
		}
	},"json");
}

//自定义移除participantsArrayRemove中带ID的JSON对象
function participantsArrayRemove(userID){
	for(var i=0;i<participantsArray.length;i++){
		if(participantsArray[i].userID == userID){
			participantsArray.splice(i,1);
		}
	}
}

//请出参会人员
function removeParticipant(thisObj,userID,delName){
	var host = getCookie('host');
	var userName = getCookie('name');
	if(host==userName){
		if(host==delName){
			$('.alertLable').text("sorry,你不能请出自己!");
	    	$("#alertDialog").modal({
		       show:true,
		       backdrop:'static',
		       keyboard:false
			});
		}else{
			//是主持人才可以请他人出去
			var btnArray = ['确认', '取消'];
			//左滑删除事件
			var elem = thisObj;
			var li = elem.parentNode.parentNode;
			mui.confirm('确认移除该人员吗？','Hello',btnArray,function(e){
				if(e.index == 0){
					li.parentNode.removeChild(li);
					//把这个userID传过去删掉这个人在这个会议上的记录
					$.post(ajaxsUrl+"meetingDelUserServlet",{meetingID:meetingID,userID:userID},
					function(data){},"json");
					participantsArrayRemove(userID);
				}
			});
		}
		
	}else{
		$('.alertLable').text("sorry,你不是主持人无权请出他人!");
    	$("#alertDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
	}
}





/****************邀请新人来参会*********************/
//邀请其他人员来参会
$('.inviteParticipant').click(function(){
	var host = getCookie('host');
	var userName = getCookie('name');
	if(host!=userName){
		$('.alertLable').text("sorry,你不是主持人，无权操作!");
    	$("#alertDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
	}else{
		$("#inviteUserDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
	}
});

//查找这个人是不是已经在这个列表里面:找到了为true,没有找到为false:列出不在会议中的人
function findUserID(userID){
	for(var j=0;j<participantsArray.length;j++){
		if(participantsArray[j].userID==userID){
			return true;
		}
	}
	return false;
}

//选择不同领域的人列出来
function participantsList(selectValue){
	if(selectValue!=''){
		$.post(ajaxsUrl+"userListServlet",{domain:selectValue,status:'激活',},
	 	function(data){
		  	var userMenus = data;
		  	domainUserListID=document.getElementById("domainUserList");
			domainUserListID.innerHTML='';
			for(var i=0;i<userMenus.length;i++){
				if(!findUserID(userMenus[i].userID)){
					var cons =  '<li class="list-group-item font12 mui-col-xs-12 mui-col-sm-12 fl">'
			            			+'<div class="checkboxFour mui-col-sm-3 mui-col-xs-3 fl">'
			            				+'<input id="checkboxFourInput'+i+'" type="checkbox" value=\''+userMenus[i].userID+'\' />' 
			            			    +'<label for="checkboxFourInput'+i+'"></label>'
			            			+'</div>'
			            			+'<div class="mui-col-sm-8 mui-col-xs-8 fl nameLable">'
			            				+userMenus[i].username
			            			+'</div>'
			            	+'</li>';
			  		//插入数据到对应区域
					domainUserListID.insertAdjacentHTML('beforeEnd',cons);
				}
			}
		},"json");
	}else{
		domainUserListID=document.getElementById("domainUserList");
		domainUserListID.innerHTML='';
	}
}

//开始为会议添加人员
$('#inviteUserDialogSure').click(function(){
	var userListCheck = $('#domainUserList input');
	var newParticipants = new Array();
	for(var i=0;i<userListCheck.length;i++){
		if(userListCheck[i].checked==true){
			console.log(userListCheck[i]);
			var userID = userListCheck[i].value;
			var thisCheck = userListCheck[i];
			var userName = $(thisCheck).parents('.checkboxFour').next().text();
			var participant = {'userID':userID,'name':userName};
			newParticipants.push(participant);
		}
	}
	if(newParticipants.length!=0){
		//如果不为空，找到被添加的成员后马上上传数据到后端
		$.post(ajaxsUrl+"inviteUserServlet",{meetingID:meetingID,inviteUser:JSON.stringify(newParticipants)},
		function(data){},"json");
		//新邀请人员成功后重新加载页面刷新
		participantList();
	}
});


//给选择问题类型加事件
function checkSelect(){
	var questionType = $(".addDiscussionType").val();
	$('#dephilPart select').val('');
	$('#SWOTPart select').val('');
	$('#competeHypothesPart select').val('');
	if(questionType=='D'){
		$('#competeHypothesPart').css('display','none');
		$('#SWOTPart').css('display','none');
		$('#dephilPart').toggle();
	}else if(questionType=='S'){
		$('#dephilPart').css('display','none');
		$('#competeHypothesPart').css('display','none');
		$('#SWOTPart').toggle();
	}else{
		$('#SWOTPart').css('display','none');
		$('#dephilPart').css('display','none');
		$('#competeHypothesPart').toggle();
	}
}


/*****************回答问题部分*********************/
//点击回答查看是哪种类型的议题
function answerDiscussion(discussionType,discussionID,questionnaireID,swotID,competeHypothesID){
	if(discussionType=='D'){
		answerQuestionnaire(questionnaireID,discussionID);
	}else if(discussionType=='S'){
		answerSwot(swotID,discussionID);
	}else{
		answerCompeteHypothes(competeHypothesID,discussionID);
	}
}
//回答议题部分:议题为德尔菲时
function answerQuestionnaire(questionnaireID,discussionID){
	//先去查看此人是否已经回答过此问卷，没有回答过才允许回答
	$.post(ajaxsUrl+"lookDephilAnswerServlet",{discussionID:discussionID,userID:userID},
		function(data){
			if(data.length==0){
				//没有回答过这个问题就可以开始回答问题
				//把这个discussionID值赋到确定button上
				$('#answerQuestionnairDialogSure').val(discussionID);
				//把所有数据渲染好以后显示:可以借用查看问卷的框架
				$("#answerQuestionnairDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
				
			}else{
				//回答过这个问题
				$('.alertLable').text("对不起你已经回答过这个议题，无法回答，请点击查看结果!");
		    	$("#alertDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
			}
		},"json");
	//把回答的问题渲染上去
	$.post(ajaxsUrl+"lookQuestionnaireServlet",{questionnaireID:questionnaireID},
			function(data){
			 	//解析json
		   		var question = data;
		   		answerQuestionnaireListID=document.getElementById("answerQuestionnaireList");
		   		answerQuestionnaireListID.innerHTML='';
		   		for(var i=0;i<question.length;i++){
		   			var cons='';
		   			if(question[i].questionType=='单选'){
		   				cons = 	'<li class="list-group-item single" value="'+question[i].questionID+'">'+
								    '<div class="row questionTitle">'+
								      	'<span>'+(i+1)+'.'+question[i].questionName+'</span>'+
								    '</div>'+
								    '<div class="row questionSelect">'+
								    	'<form>'+
									      '<div>'+
									          '<input id="itemA'+i+'" type="radio" name="itemA'+i+'" value="A">'+
									          '<label for="itemA'+i+'"></label>'+
									          '<span>A.'+question[i].selectA+'</span>'+
									      '</div>'+
									      '<div>'+
									          '<input id="itemB'+i+'" type="radio" name="itemA'+i+'" value="B">'+
									          '<label for="itemB'+i+'"></label>'+
									          '<span>B.'+question[i].selectB+'</span>'+
									      '</div>'+
									      '<div>'+
									          '<input id="itemC'+i+'" type="radio" name="itemA'+i+'" value="C">'+
									          '<label for="itemC'+i+'"></label>'+
									          '<span>C.'+question[i].selectC+'</span>'+
									      '</div>'+
									      '<div>'+
									          '<input id="itemD'+i+'" type="radio" name="itemA'+i+'" value="D">'+
									          '<label for="itemD'+i+'"></label>'+
									          '<span>D.'+question[i].selectD+'</span>'+
									      '</div>'+
									    '</form>'+
								    '</div>'+
								'</li>';
						
		   			}else if(question[i].questionType=='多选'){
		   				cons = 	'<li class="list-group-item double" value="'+question[i].questionID+'">'+
								    '<div class="row questionTitle">'+
								      	'<span>'+(i+1)+'.'+question[i].questionName+'</span>'+
								    '</div>'+
								    '<div class="row questionSelect">'+
								    	'<div class="checkbox-custom checkbox-default">'+
									        '<input type="checkbox" id="A'+i+'" value="A">'+
									        '<label for="A'+i+'">A.'+question[i].selectA+'</label>'+
									    '</div>'+
								      	'<div class="checkbox-custom checkbox-default">'+
									        '<input type="checkbox" id="B'+i+'" value="B">'+
									        '<label for="B'+i+'">B.'+question[i].selectB+'</label>'+
									    '</div>'+
									    '<div class="checkbox-custom checkbox-default">'+
									        '<input type="checkbox" id="C'+i+'" value="C">'+
									        '<label for="C'+i+'">C.'+question[i].selectC+'</label>'+
									    '</div>'+
									    '<div class="checkbox-custom checkbox-default">'+
									        '<input type="checkbox" id="D'+i+'" value="D">'+
									        '<label for="D'+i+'">D.'+question[i].selectD+'</label>'+
									    '</div>'+
									    '<div class="checkbox-custom checkbox-default">'+
									        '<input type="checkbox" id="E'+i+'" value="E">'+
									        '<label for="E'+i+'">E.'+question[i].selectE+'</label>'+
									    '</div>'+
								    '</div>'+
								'</li>';
								
		   			}else if(question[i].questionType=='简答'){
		   				cons = 	'<li class="list-group-item shortAnswer" value="'+question[i].questionID+'">'+
								    '<div class="row questionTitle">'+
								      	'<span>(简答)'+(i+1)+'.'+question[i].questionName+'</span>'+
								    '</div>'+
								    '<div class="row questionSelect">'+
								      	'<span>答案：<span>'+
								      	'<textarea class="form-control" rows="3"></textarea>'+
								    '</div>'+
								'</li>';
		   			}
		   			//插入数据到对应区域
					answerQuestionnaireListID.insertAdjacentHTML('beforeEnd',cons);
		   		}
	},"json");

}
//回答德尔菲类型问题后提交
$('#answerQuestionnairDialogSure').click(function(){
	var liList = $('#answerQuestionnaireList li');
	var discussionID = $('#answerQuestionnairDialogSure').val();
	var dephilAnswerList = new Array();
	
	for(var i=0;i<liList.length;i++){
		var questionType = liList[i].className.split(' ')[1];
		var questionID = liList[i].value;
		if(questionType=='single'){
			//如果是单选
			var inputList = $(liList[i]).find('input');
			var answer='';
			for(var a=0;a<inputList.length;a++){
				if(inputList[a].checked==true){
					answer = answer+$(inputList[a]).val();
				}
			}
			if(answer!=''){
				var dephilAnswer = {'userID':userID,'questionID':questionID,
				'discussionID':discussionID,'answer':answer};
				dephilAnswerList.push(dephilAnswer);
			}	
			
		}else if(questionType=='double'){
			//如果是多选
			var inputList = $(liList[i]).find('input');
			var answer='';
			for(var b=0;b<inputList.length;b++){
				if(inputList[b].checked==true){
					answer = answer+$(inputList[b]).val();
				}
			}
			if(answer!=''){
				var dephilAnswer = {'userID':userID,'questionID':questionID,
				'discussionID':discussionID,'answer':answer};
				dephilAnswerList.push(dephilAnswer);
			}
			
		}else if(questionType=='shortAnswer'){
			//如果是简答
			var answer = $(liList[i]).find('textarea').val();
			if(answer!=''){
				var dephilAnswer = {'userID':userID,'questionID':questionID,
				'discussionID':discussionID,'answer':answer};
				dephilAnswerList.push(dephilAnswer);
			}
			
		}
	}
	/*循环存入答案结束后开始查看答案是否都回答了*/
	if(liList.length!=dephilAnswerList.length){
		//若两个不等说明有些题没有回答
		$('.alertLable').text("对不起，您没有回答完所有问题,提交问卷失败!");
    	$("#alertDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
	}else{
		//所有题目回答完毕插入后端
		$.post(ajaxsUrl+"dephilAnswerServlet",{dephilAnswerList:JSON.stringify(dephilAnswerList)},
		function(data){
		 	//发布议题成功
			$('.alertLable1').text(data);
	    	$("#alertDialog1").modal({
		       show:true,
		       backdrop:'static',
		       keyboard:false
			});
		},"json");
	}
});

//回答议题部分:议题为态势分析时
function answerSwot(swotID,discussionID){
	
}
//回答议题部分:议题为竞争性假设时
function answerCompeteHypothes(competeHypothesID,discussionID){
	
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


/*******************群聊部分********************/
$('.enterChart').click(function(){
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
	
	//开始接入聊天室
	initWebSocket();
	$('.groupChatBox').scrollTop(2000);
	$("#groupChartDialog").modal({
       show:true,
       backdrop:'static',
       keyboard:false
	});
});

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




/***************echarts报表统计*********************/
function echartsList1(questionID,questionName,value){
	var echartID = 'echarts'+questionID;
	option = {
		title : {
	        text: questionID+'.'+questionName,
	        textStyle:{
	            fontSize: '12'
	        },
	        x:'left'
	    },
	    tooltip: {
	        trigger: 'item',
	        formatter: "{a} <br/>{b}: {c} ({d}%)"
	    },
	    legend: {
	        orient: 'vertical',
	        x: 'right',
	        y: 'center',
	        data:['A','B','C','D']
	    },
	    series: [
	        {
	            name:'选择次数',
	            type:'pie',
	            radius: ['50%', '70%'],
	            avoidLabelOverlap: false,
	            label: {
	                normal: {
	                    show: false,
	                    position: 'center'
	                },
	                emphasis: {
	                    show: true,
	                    textStyle: {
	                        fontSize: '15',
	                        fontWeight: 'bold'
	                    }
	                }
	            },
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            data:[
	                {value:value[0], name:'A'},
	                {value:value[1], name:'B'},
	                {value:value[2], name:'C'},
	                {value:value[3], name:'D'},
	            ]
	        }
	    ]
	};
	//获取dom容器
	var myChart = echarts.init(document.getElementById(echartID));
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
}

function echartsList2(questionID,questionName,value){
	var echartID = 'echarts'+questionID;
	
	var dataAxis = ['AB', 'AC', 'AD', 'AE', 'BC', 'BD', 'BE',
	    			'CD', 'CE', 'DE', 'ABC', 'ABD', 'ABE', 'BCD',
	    			'BCE','CDE','ABCD','ABCE','BCDE','ABCDE'];
	var data = [value[0], value[1], value[2], value[3], value[4], 
	    		value[5], value[6], value[7], value[8], value[9],
	    		value[10], value[11], value[12], value[13], value[14], 
	    		value[15], value[16], value[17], value[18], value[19]];
	
	option = {
    color: ['#3398DB'],
    title : {
	        text: questionID+'.'+questionName,
	        textStyle:{
	            fontSize: '12'
	        },
	        x:'left',
	        y:'20px'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : dataAxis,
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
	        {
	            name:'直接访问',
	            type:'bar',
	            barWidth: '60%',
	            data: data
	        }
	    ]
	};
	
	//获取dom容器
	var myChart = echarts.init(document.getElementById(echartID));
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
}
