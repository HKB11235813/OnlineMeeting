window.onload=function(){
	$(".name").text(getCookie('name'));
//	var cons = '<img src="'+ajaxsUrl+'img/'+getCookie('userID')+'.jpg"/>';
	var cons = '<img src="img/'+getCookie('userID')+'.jpg"/>';
	titleImgID=document.getElementById("titleImg");
	titleImgID.insertAdjacentHTML('beforeEnd',cons);
	
	$.post(ajaxsUrl+"personalMessageServlet",{userID:getCookie('userID')},
	 function(data){
	 	//解析json
	 	$("#personName").val(data.name);
	 	$("#sex").val(data.sex);
	 	$("#birthday").val(data.birthday);
	 	$("#tellphone").val(data.tellphone);
	 	$("#email").val(data.email);
	 	$("#hometown").val(data.hometown);
	 	$("#school").val(data.school);
	 	$("#personIntro").val(data.personIntro);
	},"json");
}

//修改个人资料
$('.preserve').click(function(){
	var name = $("#personName").val();
	var sex = $("#sex").val();
	var birthday = $("#birthday").val();
	var tellphone = $("#tellphone").val();
	var email = $("#email").val();
	var hometown = $("#hometown").val();
	var school = $("#school").val();
	var personIntro = $("#personIntro").val();
	var patternTel = /^1[34578]\d{9}$/;
	var patternEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	
	if(name==''||sex==''||birthday==''||tellphone==''||
		   email==''||hometown==''||school==''||personIntro==''){
			//增加用户时输入的数据存在空
			$('.addUserAlert').text('修改信息失败,请输入完整信息!');
			$("#addUserAlertDialog").modal({
		       show:true,
		       backdrop:'static',
		       keyboard:false
			});
	}else{
	    if(!(patternTel.test(tellphone))){
	    	//判断电话号码不合格时
	    	$('.addUserAlert').text('修改信息失败,电话号码格式不正确!');
	    	$("#addUserAlertDialog").modal({
		       show:true,
		       backdrop:'static',
		       keyboard:false
			});
	    	
	    }else if(!(patternEmail.test(email))){
	    	//判断电子邮箱不合格时
	    	$('.addUserAlert').text('修改信息失败,电子邮箱格式不正确!');
	    	$("#addUserAlertDialog").modal({
		       show:true,
		       backdrop:'static',
		       keyboard:false
			});
	    }else{
	    	$.post(ajaxsUrl+"updatePersonalMessageServlet",{userID:getCookie('userID'),
	    	name:name,sex:sex,birthday:birthday,tellphone:tellphone,email:email,
	    	hometown:hometown,school:school,personIntro:personIntro},
			 function(data){
			 	//解析json
			 },"json");
			 window.location.href="personalData.html";
		}
   }
});


//点击上传图片修改
$('#titleImg').click(function(){
	$('#fileClick').click();
});

function preview(obj){
	$('.addUserAlert').text('上次失败，功能正在开发中...!');
	$("#addUserAlertDialog").modal({
       show:true,
       backdrop:'static',
       keyboard:false
	});
}
