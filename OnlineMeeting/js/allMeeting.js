window.onload=function(){
	$(".name").text(getCookie('name'));
	$(".roleName").text(getCookie('roleName'));
	var meetingName = $('.meetingName').val();
	var status = $('.meetingSelect').val();
	var startTime = $('.startTime').val();
	var endTime = $('.endTime').val();
	
	
	function meetingList(name,status,startTime,endTime){
		$.post(ajaxsUrl+"allMeetingServlet",{userName:getCookie('name'),name:name,status:status,startTime:startTime,endTime:endTime},
			 function(data){
			 	//解析json
		   		var meeting = data;
		   		meetingListID=document.getElementById("meetingList");
		   		meetingListID.innerHTML='';
		   		for(var i=(pageNum-1)*5;i<meeting.length&&i<pageNum*5;i++){
		   			var cons = '<tr>'+
							      '<th scope="row">'+(i+1)+'</th>'+
							      '<td>'+meeting[i].meetingName+'</td>'+
							      '<td>'+meeting[i].startTime+'</td>'+
							      '<td>'+meeting[i].endTime+'</td>'+
							      '<td>'+meeting[i].meetingStatus+'</td>'+
							      '<td>'+meeting[i].meetingTheme+'</td>'+
							      '<td>'+meeting[i].host+'</td>'+
							      '<td>'+meeting[i].meetingAddress+'</td>'+
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
	meetingList(meetingName,status,startTime,endTime);
	//触犯翻页效果
	$('.mui-pagination').on('tap', 'a', function() {
		var meetingName = $('.meetingName').val();
		var status = $('.meetingSelect').val();
		var startTime = $('.startTime').val();
		var endTime = $('.endTime').val();
		meetingList(meetingName,status,startTime,endTime);
	});
	//查询效果
	$('#meetingSearch').click(function(){
		var meetingName = $('.meetingName').val();
		var status = $('.meetingSelect').val();
		var startTime = $('.startTime').val();
		var endTime = $('.endTime').val();
		meetingList(meetingName,status,startTime,endTime);
	})

}
