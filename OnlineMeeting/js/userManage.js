window.onload=function(){
	$(".name").text(getCookie('name'));
	$(".roleName").text(getCookie('roleName'));
	var parnt = /^(0|[1-9][0-9]*)$/;
	var currentPage=$("#currentPage").val();
	var userName = $('.userName').val();
	var role = $('.role').val();
	var domain = $('.domain').val();
	var status = $('.status').val();
	var createTime = $('.createTime').val();
	var endTime = $('.endTime').val();
	
	
	//领域选择初始化
	$.post(ajaxsUrl+"domainServlet",{domainName:'',domainType:"userDomain"},
		 function(data){
		 	//解析json
	   		var domain = data;
	   		domainListID=document.getElementById("domainList");
	   		for(var i=0;i<domain.length;i++){
	   			var cons = '<option value="'+domain[i].domainName+'">'+domain[i].domainName+'</option>';
				//插入数据到对应区域
				domainListID.insertAdjacentHTML('beforeEnd',cons);
	   		}
	},"json");
	//角色名称初始化
	$.post(ajaxsUrl+"roleServlet",{roleName:''},
		 function(data){
		 	//解析json
	   		var role = data;
	   		roleListID=document.getElementById("roleList");
	   		for(var i=0;i<role.length;i++){
	   			var cons = '<option value="'+role[i].roleName+'">'+role[i].roleName+'</option>';
				//插入数据到对应区域
				roleListID.insertAdjacentHTML('beforeEnd',cons);
	   		}
	},"json");
	
	
	
	
	//简单的列出用户
	function userList(currentPage,userName,role,domain,status,createTime,endTime){
		$.post(ajaxsUrl+"userManageServlet",{currentPage:currentPage,userName:userName,
			role:role,domain:domain,status:status,createTime:createTime,endTime:endTime},
			 function(data){
			 	//解析json
		   		var users = data;
		   		userListID=document.getElementById("userList");
		   		userListID.innerHTML='';
		   		/*设置条码*/
		   		var strLable = "共"+users[0].totalPage+"页"+users[0].totalRecord+"条记录";
		   		$("#logLable").html(strLable);
		   		setCookie('totalPage',users[0].totalPage);
		   		/*开始分页*/
		   		var j = (currentPage-1)*5;
		   		for(var i=0;i<5;i++,j++){
		   			var btnStr = '<button onclick="changeStatus(\'禁用\',\''+users[i].userID+'\')" type="button" class="btn btn-warning statusUser">禁用</button>';
		   			if(users[i].status=='禁用'){
		   				btnStr = '<button onclick="changeStatus(\'激活\',\''+users[i].userID+'\')" type="button" class="btn btn-success statusUser">激活</button>';
		   			}
		   			var cons = '<tr>'+
							      '<th scope="row">'+(j+1)+'</th>'+
							      '<td>'+users[i].username+'</td>'+
							      '<td>'+users[i].name+'</td>'+
							      '<td>'+users[i].tellphone+'</td>'+
							      '<td>'+users[i].email+'</td>'+
							      '<td>'+users[i].domain+'</td>'+
							      '<td>'+users[i].status+'</td>'+
							      '<td>'+users[i].roleName+'</td>'+
							      '<td>'+users[i].createTime+'</td>'+
							      '<td>'+
							      	'<button type="button" onclick="modifyPassword(\''+users[i].userID+'\')" class="btn btn-primary resetPassword">重置密码</button>'+
							      	'<button type="button" class="btn btn-info editUser">编辑</button>'+
							      	 btnStr+
							      	'<button type="button" class="btn btn-danger delUser">删除</button>'+
							      '</td>'+
							    '</tr>';
					//插入数据到对应区域
					userListID.insertAdjacentHTML('beforeEnd',cons);
		   		}
			},"json");
	}
	
	//初始化先执行一次
	userList(currentPage,userName,role,domain,status,createTime,endTime);
	
	//触犯翻页效果
	$('.pageLast').click(function(){
		var userName = $('.userName').val();
		var role = $('.role').val();
		var domain = $('.domain').val();
		var status = $('.status').val();
		var createTime = $('.createTime').val();
		var endTime = $('.endTime').val();
		if(currentPage>1){
			currentPage--;
		}
		$("#currentPage").val(currentPage);
		userList(currentPage,userName,role,domain,status,createTime,endTime);
	});
	$('.pageNext').click(function(){
		//取出总页数
		var totalPage = getCookie('totalPage');
		var userName = $('.userName').val();
		var role = $('.role').val();
		var domain = $('.domain').val();
		var status = $('.status').val();
		var createTime = $('.createTime').val();
		var endTime = $('.endTime').val();
		if(currentPage<totalPage){
			currentPage++;
		}else{
			currentPage = 1;
		}
		$("#currentPage").val(currentPage);
		userList(currentPage,userName,role,domain,status,createTime,endTime);
	});
	//页数跳转效果
	$('.goPage').click(function(){
		//取出总页数
		var totalPage = getCookie('totalPage');
		var userName = $('.userName').val();
		var role = $('.role').val();
		var domain = $('.domain').val();
		var status = $('.status').val();
		var createTime = $('.createTime').val();
		var endTime = $('.endTime').val();
		
		if(parnt.exec($("#currentPage").val())){
			currentPage=$("#currentPage").val();
			if(currentPage>totalPage||currentPage<1){
				currentPage=1;
			}
		}else{
			currentPage = 1;
		}
		$("#currentPage").val(currentPage);
		userList(currentPage,userName,role,domain,status,createTime,endTime);
	});
	//查询效果
	$('.logSearch').click(function(){
		currentPage = 1;
		$("#currentPage").val(currentPage);
		var userName = $('.userName').val();
		var role = $('.role').val();
		var domain = $('.domain').val();
		var status = $('.status').val();
		var createTime = $('.createTime').val();
		var endTime = $('.endTime').val();
		userList(currentPage,userName,role,domain,status,createTime,endTime);
	});
	
	
	//新增用户功能dialog
	$(".addUser").click(function(){
	    $("#addUserDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
		//领域名称初始化
		$.post(ajaxsUrl+"domainServlet",{domainName:'',domainType:"userDomain"},
		 function(data){
		 	//解析json
	   		var domain = data;
	   		domainListID=document.getElementById("domainListDialog");
	   		domainListID.innerHTML='';
	   		for(var i=0;i<domain.length;i++){
	   			var cons = '<option value="'+domain[i].domainID+'">'+domain[i].domainName+'</option>';
				//插入数据到对应区域
				domainListID.insertAdjacentHTML('beforeEnd',cons);
	   		}
		},"json");
		//角色名称初始化
		$.post(ajaxsUrl+"roleServlet",{roleName:''},
			 function(data){
			 	//解析json
		   		var role = data;
		   		roleListID=document.getElementById("roleListDialog");
		   		roleListID.innerHTML='';
		   		for(var i=0;i<role.length;i++){
		   			var cons = '<option value="'+role[i].roleID+'">'+role[i].roleName+'</option>';
					//插入数据到对应区域
					roleListID.insertAdjacentHTML('beforeEnd',cons);
		   		}
		},"json");
		
		
	});
	
	
	
	var patternTel = /^1[34578]\d{9}$/;
	var patternEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	/*********新增用户确认传入数据增加用户*************/
	$('#addUserSure').click(function(){
		var addname = $('.addname').val();
		var addUsername = $('.addUsername').val();
		var addPassword = $('.addPassword').val();
		var addPasswordSure = $('.addPasswordSure').val();
		var addDomain = $('.addDomain').val();
		var addRole = $('.addRole').val();
		var addTellphone = $('.addTellphone').val();
		var addEmail = $('.addEmail').val();
		
		
		if(addname==''||addUsername==''||addPassword==''||
		   addPasswordSure==''||addDomain==''||addRole==''||
		   addTellphone==''||addEmail==''
		){
			//增加用户时输入的数据存在空
			$('.addUserAlert').text('添加用户失败,请输入完整信息!');
			$("#addUserAlertDialog").modal({
		       show:true,
		       backdrop:'static',
		       keyboard:false
			});
			
		}else{
		    //输入的数据都有时，再来判断输入格式是否合格
		    if(addPassword!=addPasswordSure){
		    	//判断是否两个密码不等
		    	$('.addUserAlert').text('添加用户失败,确认密码不正确!');
		    	$("#addUserAlertDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
		    	
		    }else if(!(patternTel.test(addTellphone))){
		    	//判断电话号码不合格时
		    	$('.addUserAlert').text('添加用户失败,电话号码格式不正确!');
		    	$("#addUserAlertDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
		    	
		    }else if(!(patternEmail.test(addEmail))){
		    	//判断电子邮箱不合格时
		    	$('.addUserAlert').text('添加用户失败,电子邮箱格式不正确!');
		    	$("#addUserAlertDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
		    }else{
		    	//判断全部合格然后可以传输数据进行插入用户数据
		    	$.post(ajaxsUrl+"addUserServlet",{addname:addname,addUsername:addUsername,
		    	addPassword:addPassword,addDomain:addDomain,addRole:addRole,
		    	addTellphone:addTellphone,addEmail:addEmail},
			 	function(data){
				 	$('.addUserAlert').text(data);
			    	$("#addUserAlertDialog").modal({
				       show:true,
				       backdrop:'static',
				       keyboard:false
					});
				},"json");
		    
		    }
		}
	});
	/**********新增用户判断结束***********/
	
	
}

//修改密码
function modifyPassword(userID){
	$('#modifyPassword').val(userID);
	
	$("#modifyPasswordDialog").modal({
       show:true,
       backdrop:'static',
       keyboard:false
	});
}
$('#modifyPassword').click(function(){
	var userID = $('#modifyPassword').val();
	var modifyPassword = $('.modifyPassword').val();
	var modifyPasswordSure = $('.modifyPasswordSure').val();
	
	if(modifyPassword=='' || modifyPasswordSure==''){
		//修改时输入的数据存在空
		$('.addUserAlert').text('修改密码失败,请输入完整信息!');
		$("#addUserAlertDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
		
		
	}else{
		if(modifyPassword!=modifyPasswordSure){
		//修改时输入的数据两者不相等
			$('.modifyPassword').val('');
			$('.modifyPasswordSure').val('');
			$('.addUserAlert').text('修改密码失败,确认密码与新密码不一致!');
			$("#addUserAlertDialog").modal({
		       show:true,
		       backdrop:'static',
		       keyboard:false
			});
			
		}else{
			//两者一样了则可以写入数据
			//判断全部合格然后可以传输数据进行插入用户数据
	    	$.post(ajaxsUrl+"modifyPasswordServlet",{userID:userID,modifyPassword:modifyPassword},
		 	function(data){
			 	$('.addUserAlert').text(data);
		    	$("#addUserAlertDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
			},"json");
		}
	}
	
})

//修改用户状态
function changeStatus(status,userID){
	
	var btnArray = ['确认', '取消'];
	mui.confirm('确定'+status+'该用户吗？','Hello',btnArray,function(e){
		if(e.index == 0){
			$.post(ajaxsUrl+"modifyStatusServlet",{userID:userID,status:status},
		 	function(data){
		 		//带刷新页面的功能
			 	$('.addUserAlert1').text(data);
		    	$("#addUserAlertDialog1").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
			},"json");
		}
	});
	
}
