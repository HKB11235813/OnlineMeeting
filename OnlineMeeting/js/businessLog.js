window.onload=function(){
	$(".name").text(getCookie('name'));
	$(".roleName").text(getCookie('roleName'));
	var parnt = /^(0|[1-9][0-9]*)$/;
	var currentPage=$("#currentPage").val();
	var userName = $('.userName').val();
	var operateTime = $('.operateTime').val();
	var endTime = $('.endTime').val();
	
	function logList(currentPage,userName,operateTime,endTime){
		$.post(ajaxsUrl+"businessLogServlet",{currentPage:currentPage,userName:userName,operateTime:operateTime,endTime:endTime},
			 function(data){
			 	//解析json
		   		var logs = data;
		   		logListID=document.getElementById("logList");
		   		logListID.innerHTML='';
		   		/*设置条码*/
		   		var strLable = "共"+logs[0].totalPage+"页"+logs[0].totalRecord+"条记录";
		   		$("#logLable").html(strLable);
		   		setCookie('totalPage',logs[0].totalPage);
		   		/*开始分页*/
		   		var j = (currentPage-1)*5;
		   		for(var i=0;i<5;i++,j++){
		   			var cons = '<tr>'+
							      '<th scope="row">'+(j+1)+'</th>'+
							      '<td>'+logs[i].userName+'</td>'+
							      '<td>'+logs[i].operateTime+'</td>'+
							      '<td>'+logs[i].module+'</td>'+
							      '<td>'+logs[i].operate+'</td>'+
							      '<td>'+logs[i].parameter+'</td>'+
							    '</tr>';
					//插入数据到对应区域
					logListID.insertAdjacentHTML('beforeEnd',cons);
		   		}
			},"json");
	}
	
	//初始化先执行一次
	logList(currentPage,userName,operateTime,endTime);
	
	//触犯翻页效果
	$('.pageLast').click(function(){
		var userName = $('.userName').val();
		var operateTime = $('.operateTime').val();
		var endTime = $('.endTime').val();
		if(currentPage>1){
			currentPage--;
		}
		$("#currentPage").val(currentPage);
		logList(currentPage,userName,operateTime,endTime);
	});
	$('.pageNext').click(function(){
		//取出总页数
		var totalPage = getCookie('totalPage');
		var userName = $('.userName').val();
		var operateTime = $('.operateTime').val();
		var endTime = $('.endTime').val();
		if(currentPage<totalPage){
			currentPage++;
		}else{
			currentPage = 1;
		}
		$("#currentPage").val(currentPage);
		logList(currentPage,userName,operateTime,endTime);
	});
	//页数跳转效果
	$('.goPage').click(function(){
		//取出总页数
		var totalPage = getCookie('totalPage');
		var userName = $('.userName').val();
		var operateTime = $('.operateTime').val();
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
		logList(currentPage,userName,operateTime,endTime);
	});
	//查询效果
	$('.logSearch').click(function(){
		currentPage = 1;
		$("#currentPage").val(currentPage);
		var userName = $('.userName').val();
		var operateTime = $('.operateTime').val();
		var endTime = $('.endTime').val();
		logList(currentPage,userName,operateTime,endTime);
	});
	
}