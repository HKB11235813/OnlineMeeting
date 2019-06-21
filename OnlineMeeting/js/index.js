$(".loginButton").click(function(){
	
	if($(".username").val()==''){
		$(".modalAlert").text("请输入用户名!");
		    $("#myModal").modal({
		       show:true,
		       backdrop:'static',
		       keyboard:false
		})
	}else if($(".password").val()==''){
		$(".modalAlert").text("请输入密码!");
		    $("#myModal").modal({
		       show:true,
		       backdrop:'static',
		       keyboard:false
		})
	}else{
		//当输入都不为空时
		$.post(ajaxsUrl+"loginServlet",{username:$(".username").val(),password:$(".password").val()},
				 function(data){
				 	//解析json
			 		user = data;
			 		if(user.userJudge==0){
			 			$(".modalAlert").text("用户不存在!");
					    $("#myModal").modal({
					       show:true,
					       backdrop:'static',
					       keyboard:false
					    })
					 
					}else if(user.userJudge==1){
						$(".modalAlert").text("用户密码错误!");
					    $("#myModal").modal({
					       show:true,
					       backdrop:'static',
					       keyboard:false
					    })
					}else{
						//页面传参设置cookie
						setCookie('name',user.name,1);
						setCookie('roleName',user.roleName,1);
						setCookie('userID',user.userID,1);
						setCookie('roleID',user.roleID,1);
						window.location.href="mainbody.html";
					}
				},"json");
	}
});


