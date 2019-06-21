//var ajaxsUrl = 'http://localhost:8080/onlineMeeting/';
//var groupChatUrl = "ws://localhost:8080/onlineMeeting/webSocket/chat/";
var ajaxsUrl = 'http://119.3.229.138/';
var groupChatUrl = "ws://119.3.229.138/webSocket/chat/";
var user;//全局变量user
////网页端版本cookie设置
//function setCookie(c_name,value,expiredays)
//{
//	var exdate=new Date();
//	exdate.setDate(exdate.getDate()+expiredays);
//	document.cookie=c_name+ "=" +escape(value)+
//	((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
//}
//function getCookie(c_name)
//{
//	if (document.cookie.length>0)
//	{
//		c_start=document.cookie.indexOf(c_name + "=");
//		if (c_start!=-1)
//  	{ 
//  		c_start=c_start + c_name.length+1;
//  		c_end=document.cookie.indexOf(";",c_start);
//  	if (c_end==-1) c_end=document.cookie.length
//  		return unescape(document.cookie.substring(c_start,c_end));
//  	} 
//}
//	return ""
//}


//cookie设置APP版本，用数据库来存cookie
function setCookie(c_name,value,expiredays)
{
	window.localStorage.setItem(c_name,value);
}




function getCookie(c_name)
{
	return window.localStorage.getItem(c_name);
}





!function($){
	//1.找到指定按钮
	$("#headerPic").click(function(){
		$(this).children(".submenu").toggle();
	});
	
	//主菜单的下拉效果
	$(".menu").click(function(){
		//找到侧栏菜单，并且隐藏起来
		$("#sider-menu").toggle(200);
		$(".content-page").toggleClass("ml0");
	});
	
	//点击非菜单区域隐藏菜单
	$("#allMeetingBody").on("tap",function(){
		//找到侧栏菜单，并且隐藏起来
		if(!$("#sider-menu").is(":hidden")){
			$("#sider-menu").css("display","none");
		}
	});
	//点击非菜单区域隐藏菜单
	$("#body-menu").on("tap",function(){
		//找到侧栏菜单，并且隐藏起来
		if(!$("#sider-menu").is(":hidden")){
			$("#sider-menu").css("display","none");
		}
	});
	
	//子菜单效果
	$("#mainmenu>li").click(function(){
		//先把所有.submenu隐藏起来
		$("#mainmenu>li .submenu").hide();
		//先清除加上去的减号，还原加号
		$("#mainmenu>li a i:last-child").removeClass("fa-minus").addClass("fa-plus");
		
		
		//当前绑定.active，li的同级删除.active
		$(this).toggleClass("active").siblings().removeClass("active");
		
		//判定li上面是否有指定active的类，如果有则显示下现的内容，如果没有则隐藏下面的内容（.submenu）
		if($(this).hasClass("active")){
			$(this).children(".submenu").toggle();
			//找到指定对象，先移除加号，再加上减号
			$(this).children("a").children("i:last-child").removeClass("fa-plus").addClass("fa-minus");
		}
		
	});
	
	//tab切换效果
	$("#tab>li").click(function(){
		//1.li加选中效果
		$(this).addClass("active").siblings().removeClass("active");
		//如何让对应li选中tabcontent显示出来？
		//使用索引值来关联
		
		//console.log($(this).index());
		
		
		//2.把拿到索引给一个变量存起来
		var index=$(this).index();
		
		//3.把索引和内容tabcontent联系起来
		$(".tabcontent").eq(index).show().siblings(".tabcontent").hide();
	})
	
	//页面的跳转
	mui.init();
	mui('.mui-bar-tab').on('tap','a',function(){
		//1步骤:获取当前a标签中的href的值作为页面跳转的标识
		var id=this.getAttribute("href");
		window.location.href=id;	
	});
	
	$('.logo strong').text('会议研讨系统');
	
}(window.jQuery)


