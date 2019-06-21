window.onload=function(){
	$(".name").text(getCookie('name'));
	$(".roleName").text(getCookie('roleName'));
	var themeName = $('.themeName').val();
	var meetingName = $('.meetingName').val();
	var updateTime = $('.updateTime').val();
	var endTime = $('.endTime').val();
	
	
	function meetingList(themeName,meetingName,updateTime,endTime){
		$.post(ajaxsUrl+"meetingAbstractServlet",{userName:getCookie('name'),themeName:themeName,meetingName:meetingName,updateTime:updateTime,endTime:endTime},
			 function(data){
			 	//解析json
		   		var meetingTheme = data;
		   		console.log(meetingTheme);
		   		meetingListID=document.getElementById("meetingList");
		   		meetingListID.innerHTML='';
		   		for(var i=(pageNum-1)*5;i<meetingTheme.length&&i<pageNum*5;i++){
		   			var cons = '<tr>'+
							      '<th scope="row">'+(i+1)+'</th>'+
							      '<td>'+meetingTheme[i].meetingTheme+'</td>'+
							      '<td>'+meetingTheme[i].meetingName+'</td>'+
							      '<td>'+meetingTheme[i].creatThemeTime+'</td>'+
							      '<td>'+meetingTheme[i].documentName+'</td>'+
							      '<td>'+meetingTheme[i].updateThemeTime+'</td>'+
							      '<td>'+meetingTheme[i].themeAuthor+'</td>'+
							      '<td>'+
							      	'<button type="button" class="btn btn-warning">编辑</button>'+
							      	'<button type="button" class="btn btn-danger">删除</button>'	+
							      '</td>'+
							    '</tr>';
					//插入数据到对应区域
					meetingListID.insertAdjacentHTML('beforeEnd',cons);
		   		}	
			},"json");
	}
	
	//初始化先执行一次
	meetingList(themeName,meetingName,updateTime,endTime);
	//触犯翻页效果
	$('.mui-pagination').on('tap', 'a', function() {
		var themeName = $('.themeName').val();
		var meetingName = $('.meetingName').val();
		var updateTime = $('.updateTime').val();
		var endTime = $('.endTime').val();
		meetingList(themeName,meetingName,updateTime,endTime);
	});
	//查询效果
	$('#meetingSearch').click(function(){
		var themeName = $('.themeName').val();
		var meetingName = $('.meetingName').val();
		var updateTime = $('.updateTime').val();
		var endTime = $('.endTime').val();
		meetingList(themeName,meetingName,updateTime,endTime);
	})

}
