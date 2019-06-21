var participants = new Array();
var meeting={};

window.onload=function(){
	$(".name").text(getCookie('name'));
	$(".roleName").text(getCookie('roleName'));
	
	//会议领域选择初始化
	$.post(ajaxsUrl+"domainServlet",{domainName:'',domainType:"meetingDomain"},
		 function(data){
		 	//解析json
	   		var domain = data;
	   		meetingDomainListID=document.getElementById("meetingDomainList");
	   		for(var i=0;i<domain.length;i++){
	   			var cons = '<option value="'+domain[i].domainID+'">'+domain[i].domainName+'</option>';
				//插入数据到对应区域
				meetingDomainListID.insertAdjacentHTML('beforeEnd',cons);
	   		}
	},"json");
	//会议地址选择初始化
	$.post(ajaxsUrl+"meetingAddressServlet",{meetingAddress:''},
		 function(data){
		 	//解析json
	   		var addrList = data;
	   		addrListID=document.getElementById("addrList");
	   		for(var i=0;i<addrList.length;i++){
	   			var cons = '<option value="'+addrList[i].addressID+'">'+addrList[i].meetingAddress+'</option>';
				//插入数据到对应区域
				addrListID.insertAdjacentHTML('beforeEnd',cons);
	   		}
	},"json");
	//会议纪要选择初始化
	$.post(ajaxsUrl+"meetingThemeServlet",{meetingTheme:''},
		 function(data){
		 	//解析json
	   		var meetingThemeList = data;
	   		ThemeListID=document.getElementById("meetingThemeList");
	   		for(var i=0;i<meetingThemeList.length;i++){
	   			var cons = '<option value="'+meetingThemeList[i].meetingThemeID+'">'+meetingThemeList[i].meetingTheme+'</option>';
				//插入数据到对应区域
				ThemeListID.insertAdjacentHTML('beforeEnd',cons);
	   		}
	},"json");
	
	
	/*********创建会议点击下一步传入数据增加用户*************/
	$('#nextStep').click(function(){
		$('#home-tab').click();
		var meetingName = $('.meetingName').val();
		var startTime = $('.startTime').val();
		var endTime = $('.endTime').val();
		var meetingAddress = $('.meetingAddress').val();
		var meetingDomain = $('.meetingDomain').val();
		var meetingTheme = $('.meetingTheme').val();
		var meetingKeyWord = $('.meetingKeyWord').val();
		var meetingIntroduce = $('.meetingIntroduce').val();
		
		if(meetingName==''||startTime==''||endTime==''||meetingAddress==''||
		   meetingDomain==''||meetingTheme==''||meetingKeyWord==''||meetingIntroduce==''){
			//增加用户时输入的数据存在空
			$('.createMeetingAlert').text('创建会议失败,请输入完整信息!');
			$("#createMeetingDialog").modal({
		       show:true,
		       backdrop:'static',
		       keyboard:false
			});
			
		}else{
			if(startTime >= endTime){
				$('.createMeetingAlert').text('创建会议失败,开始时间应早于结束时间!');
				$("#createMeetingDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
			}else if(curDateTime() > startTime){
				$('.createMeetingAlert').text('创建会议失败,开始时间应晚于现在时间!');
				$("#createMeetingDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
			}else{
				/*******第一步完成后将所有数据存起来*******/
				meeting ={
					'meetingName':meetingName,
					'startTime':startTime,
					'endTime':endTime,
					'meetingAddress':meetingAddress,
					'meetingDomain':meetingDomain,
					'meetingTheme':meetingTheme,
					'meetingKeyword':meetingKeyWord,
					'meetingIntro':meetingIntroduce,
					'host':getCookie('name')
				};
				
				$(".firstStep").css("display","none");
				$(".secondStep").css("display","inline-block");
				/*****第一步成功后第二步*****/
				/**********选择参会人员部分：等会要放进到第二步里面,测试先放这***********/
				
				//人员领域选择初始化
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
				
				//点击添加按钮后添加人员到数组里面
				$('.addParticipants').click(function(){
					//先将选中的所有人员加到JOSN数组里面
					var userListCheck = $('#domainUserList input');
					for(var i=0;i<userListCheck.length;i++){
						if(userListCheck[i].checked==true){
							var userID = userListCheck[i].value;
							var thisCheck = userListCheck[i];
							var userName = $(thisCheck).parents('.checkboxFour').next().text();
							var participant = {'userID':userID,'name':userName};
							//若participants不为空则时去循环找一下有咩有重复人员，防止重复添加相同人员
							if(participants.length==0){//判断是因为第一次肯定为空,后面不为空的时候再遍历查看
								participants.push(participant);
							}else{
								var isExistflag = 0;
								for(var j=0;j<participants.length;j++){
									if(participants[j].userID == participant.userID){
										isExistflag=1;
										break;
									}
								}
								if(isExistflag==0){
									participants.push(participant);
								}
							}
						}
					}
					//添加完人员后在把选中的人放到右边
					participantsID=document.getElementById("participants");
					participantsID.innerHTML='';
					for(var i=0;i<participants.length;i++){
				   		var cons = '<li class="mui-table-view-cell getUserID" value="'+participants[i].userID+'">'
										+'<div class="mui-slider-right mui-disabled">'
											+'<a class="mui-btn mui-btn-red">删除</a>'
										+'</div>'
										+'<div class="mui-slider-handle">'
											+participants[i].name;
										+'</div>'
									+'</li>';
						//插入数据到对应区域
						participantsID.insertAdjacentHTML('beforeEnd',cons);
				   }
				});
				/**********选择参会人员部分：等会要放进到第二步里面,结束***********/
			
				
			}
		}
	});
	/**********创建会议点击下一步传入数据增加用户结束***********/
	
	
	/********选择人员监听创建会议是否完成******/
	$("#createMeetingEnd").click(function(){
		
		if(participants.length<=3){
			$('.createMeetingAlert').text('创建会议失败,参会人员必须大于3人!');
		    $("#createMeetingDialog").modal({
	      	 	show:true,
	       		backdrop:'static',
	       		keyboard:false
			});
		}else{
			//会议信息和参会人员全部选完后开始传送数据到后端
			//判断全部合格然后可以传输数据进行插入用户数据
	    	$.post(ajaxsUrl+"createMeetingServlet",{'meeting':JSON.stringify(meeting),
	    	'participants':JSON.stringify(participants)},
		 	function(data){
			 	$('.createMeetingAlert1').text(data);
		    	$("#createMeetingDialog1").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
			},"json");
		}
	});
	/********选择人员监听创建会议是否完成******/
}


//获取格式为YY:MM:DD hh:mm:ss样式的当前时间
function curDateTime(){
	var d = new Date();
	var year = d.getYear()<1900 ? (d.getYear() + 1900):d.getYear();
	var month = d.getMonth()+1; 
	var date = d.getDate(); 
	var day = d.getDay(); 
	var hours = d.getHours(); 
	var minutes = d.getMinutes(); 
	var seconds = d.getSeconds(); 
	var ms = d.getMilliseconds();   
	var curDateTime= year;
	if(month>9)
	 curDateTime = curDateTime +"-"+month;
	else
	 curDateTime = curDateTime +"-0"+month;
	if(date>9)
	 curDateTime = curDateTime +"-"+date;
	else
	 curDateTime = curDateTime +"-0"+date;
	if(hours>9)
	 curDateTime = curDateTime +" "+hours;
	else
	 curDateTime = curDateTime +" 0"+hours;
	if(minutes>9)
	 curDateTime = curDateTime +":"+minutes;
	else
	 curDateTime = curDateTime +":0"+minutes;
	if(seconds>9)
	 curDateTime = curDateTime +":"+seconds;
	else
	 curDateTime = curDateTime +":0"+seconds;
	return curDateTime; 
}

function participantsList(selectValue){
	$('#home-tab').click();
	if(selectValue!=''){
		$.post(ajaxsUrl+"userListServlet",{domain:selectValue,status:'激活',},
	 	function(data){
		  	var userMenus = data;
		  	domainUserListID=document.getElementById("domainUserList");
			domainUserListID.innerHTML='';
			for(var i=0;i<userMenus.length;i++){
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
		},"json");
	}else{
		domainUserListID=document.getElementById("domainUserList");
		domainUserListID.innerHTML='';
	}
}


//自定义移除participants中带ID的JSON对象
function participantsRemove(userID){
	for(var i=0;i<participants.length;i++){
		if(participants[i].userID == userID){
			participants.splice(i,1);
		}
	}
}

(function($){
	var btnArray = ['确认', '取消'];
	//左滑删除事件
	$('.OA_task_1').on('tap', '.mui-btn', function(event) {
		var elem = this;
		var li = elem.parentNode.parentNode;
		mui.confirm('确认移除该人员吗？','Hello',btnArray,function(e){
			if(e.index == 0){
				participantsRemove(li.value);
				li.parentNode.removeChild(li);
			}else{
				setTimeout(function() {
					$.swipeoutClose(li);
				}, 0);
			}
		});
	});
})(mui);