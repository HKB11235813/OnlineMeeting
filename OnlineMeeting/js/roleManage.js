window.onload=function(){
	$(".name").text(getCookie('name'));
	$(".roleName").text(getCookie('roleName'));
	var parnt = /^(0|[1-9][0-9]*)$/;
	var currentPage=$("#currentPage").val();
	var roleName = $('.role-name').val();
	
	//简单的列出地址
	function roleList(currentPage,roleName){
		$.post(ajaxsUrl+"roleManageServlet",{currentPage:currentPage,roleName:roleName},
			 function(data){
			 	//解析json
		   		var role = data;
		   		roleListID=document.getElementById("roleList_tbody");
		   		roleListID.innerHTML='';
		   		/*设置条码*/
		   		var strLable = "共"+role[0].totalPage+"页"+role[0].totalRecord+"条记录";
		   		$("#logLable").html(strLable);
		   		setCookie('totalPage',role[0].totalPage);
		   		/*开始分页*/
		   		var j = (currentPage-1)*5;
		   		for(var i=0;i<5;i++,j++){
		   			var cons = '<tr>'+
							      '<th scope="row">'+(j+1)+'</th>'+
							      '<td>'+role[i].roleName+'</td>'+
							      '<td>'+role[i].roleDescript+'</td>'+
							      '<td>'+role[i].createName+'</td>'+
							      '<td>'+role[i].createTime+'</td>'+
							      '<td>'+
							      	'<button type="button" class="btn btn-info editRole" onclick="editRoleFunc(\''+role[i].roleName+'\')">权限编辑</button>'+
							      	'<button type="button" class="btn btn-danger delRole">删除</button>'+
							      '</td>'+
							    '</tr>';
					//插入数据到对应区域
					roleListID.insertAdjacentHTML('beforeEnd',cons);
		   		}
			},"json");
	}
	
	//初始化先执行一次
	roleList(currentPage,roleName);
	
	//触犯翻页效果
	$('.pageLast').click(function(){
		var roleName = $('.role-name').val();
		if(currentPage>1){
			currentPage--;
		}
		$("#currentPage").val(currentPage);
		roleList(currentPage,roleName);
	});
	$('.pageNext').click(function(){
		//取出总页数
		var totalPage = getCookie('totalPage');
		var roleName = $('.role-name').val();
		if(currentPage<totalPage){
			currentPage++;
		}else{
			currentPage = 1;
		}
		$("#currentPage").val(currentPage);
		roleList(currentPage,roleName);
	});
	//页数跳转效果
	$('.goPage').click(function(){
		//取出总页数
		var totalPage = getCookie('totalPage');
		var roleName = $('.role-name').val();
		
		if(parnt.exec($("#currentPage").val())){
			currentPage=$("#currentPage").val();
			if(currentPage>totalPage||currentPage<1){
				currentPage=1;
			}
		}else{
			currentPage = 1;
		}
		$("#currentPage").val(currentPage);
		roleList(currentPage,roleName);
	});
	//查询效果
	$('.roleSearch').click(function(){
		currentPage = 1;
		$("#currentPage").val(currentPage);
		var roleName = $('.role-name').val();
		console.log(roleName);
		roleList(currentPage,roleName);
	});
	
	
	//新增角色功能dialog
	$(".addRole").click(function(){
	    $("#addRoleDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
		//权限菜单选择
		menuCheckID=document.getElementById("menuCheck");
		menuCheckID.innerHTML='';
		var menu=new Array("全部会议","会议纪要","创建会议","德尔菲","SWOT","竞争性假设",
		"工具使用情况","报文数据","多媒体数据","外部专家数据","语音白板数据","历史会议数据","其他数据",
		"登录日志","业务日志","地址管理","用户管理","角色管理","领域管理");
		for(var i=0;i<menu.length;i++){
   			var cons = '<div class="mui-col-xs-4 mui-col-sm-3 fl">'+
		        			'<input class="fl" type="checkbox" value="'+(i+1)+'" aria-label="Text input with checkbox">'+
		        			'<span class="font12">'+menu[i]+'</span>'+
		        		'</div>'
			//插入数据到对应区域
			menuCheckID.insertAdjacentHTML('beforeEnd',cons);
		}
		
	});
	
	
	
	/*********新增角色确认传入数据增加用户*************/
	$('#addRoleSure').click(function(){
		var addRoleName = $('.addRoleName').val();
		var addRoleDescript = $('.addRoleDescript').val();
		var menuPermissionID ='';
		
		var menuChecks = $('#menuCheck input');
		for(var i=0;i < menuChecks.length;i++){
			if(menuChecks[i].checked==true){
				menuPermissionID += (i+1)+',';
			}
		}
		
		if(addRoleName==''||addRoleDescript==''||menuPermissionID==''){
			//增加用户时输入的数据存在空
			$('.addRoleAlert').text('添加角色失败,请输入完整信息!');
			$("#addRoleAlertDialog").modal({
		       show:true,
		       backdrop:'static',
		       keyboard:false
			});
			
		}else{
			//判断全部合格然后可以传输数据进行插入用户数据
	    	$.post(ajaxsUrl+"addRoleServlet",{addRoleName:addRoleName,
	    	addRoleDescript:addRoleDescript,menuPermissionID:menuPermissionID,
	    	createUser:getCookie('name')},
		 	function(data){
			 	$('.addRoleAlert').text(data);
		    	$("#addRoleAlertDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
			},"json");
		}
	});
	/**********新增角色判断结束***********/
}

/*******权限编辑*******/
function editRoleFunc(selectRoleName){
 	$("#editDialog").modal({
       show:true,
       backdrop:'static',
       keyboard:false
	});
	$('.editRoleName').val(selectRoleName);
	/**插入原有的菜单权限*/
	$.post(ajaxsUrl+"roleMenuServlet",{selectRoleName:selectRoleName},
 	function(data){
	  	var oldMenus = data;
	  	oldMenuID=document.getElementById("oldMenu");
		oldMenuID.innerHTML='';
		for(var i=0;i<oldMenus.length;i++){
		  	var cons = '<li class="list-group-item font12 mui-col-xs-4 mui-col-sm-3 fl">'+oldMenus[i]+'</li>';
		  	//插入数据到对应区域
			oldMenuID.insertAdjacentHTML('beforeEnd',cons);
		}
	},"json");
	/*选择新的功能、权限菜单选择*/
	newMenuID=document.getElementById("newMenu");
	newMenuID.innerHTML='';
	var menu=new Array("全部会议","会议纪要","创建会议","德尔菲","SWOT","竞争性假设",
	"工具使用情况","报文数据","多媒体数据","外部专家数据","语音白板数据","历史会议数据","其他数据",
	"登录日志","业务日志","地址管理","用户管理","角色管理","领域管理");
	for(var i=0;i<menu.length;i++){
		var cons = '<div class="mui-col-xs-4 mui-col-sm-3 fl">'+
	        			'<input class="fl" type="checkbox" value="'+(i+1)+'" aria-label="Checkbox for following text input">'+
	        			'<span class="font12">'+menu[i]+'</span>'+
	        		'</div>'
		//插入数据到对应区域
		newMenuID.insertAdjacentHTML('beforeEnd',cons);
	}
	
	
}
/*********编辑角色确认传入数据增加用户*************/
$('#editSure').click(function(){
	var menuPermissionID ='';
	var newMenu = $('#newMenu input');
	for(var i=0;i < newMenu.length;i++){
		if(newMenu[i].checked==true){
			menuPermissionID += (i+1)+',';
		}
	}
	if(menuPermissionID==''){
		//增加用户时输入的数据存在空
		$('.addRoleAlert').text('编辑权限失败,请选择新功能菜单!');
		$("#addRoleAlertDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
		
	}else{
		//判断全部合格然后可以传输数据进行插入用户数据
    	$.post(ajaxsUrl+"editMenuServlet",{selectRoleName:$('.editRoleName').val(),menuPermissionID:menuPermissionID},
	 	function(data){
		 	$('.addRoleAlert').text(data);
	    	$("#addRoleAlertDialog").modal({
		       show:true,
		       backdrop:'static',
		       keyboard:false
			});
		},"json");
	}
});
/**********编辑角色判断结束***********/
	