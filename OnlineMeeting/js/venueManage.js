window.onload=function(){
	$(".name").text(getCookie('name'));
	$(".roleName").text(getCookie('roleName'));
	var parnt = /^(0|[1-9][0-9]*)$/;
	var currentPage=$("#currentPage").val();
	var meetingAddress = $('.meetingAddress').val();
	var addressStatus = $('.addressStatus').val();
	

	//简单的列出地址
	function addressList(currentPage,meetingAddress,addressStatus){
		$.post(ajaxsUrl+"venueManageServlet",{currentPage:currentPage,meetingAddress:meetingAddress,
			addressStatus:addressStatus},
			 function(data){
			 	//解析json
		   		var address = data;
		   		addressListID=document.getElementById("addressList");
		   		addressListID.innerHTML='';
		   		/*设置条码*/
		   		var strLable = "共"+address[0].totalPage+"页"+address[0].totalRecord+"条记录";
		   		$("#logLable").html(strLable);
		   		setCookie('totalPage',address[0].totalPage);
		   		/*开始分页*/
		   		var j = (currentPage-1)*5;
		   		for(var i=0;i<5;i++,j++){
		   			var cons = '<tr>'+
							      '<th scope="row">'+(j+1)+'</th>'+
							      '<td>'+address[i].meetingAddress+'</td>'+
							      '<td>'+address[i].addressStatus+'</td>'+
							      '<td>'+address[i].createUser+'</td>'+
							      '<td>'+address[i].openTime+'</td>'+
							      '<td>'+address[i].closeTime+'</td>'+
							      '<td>'+
							      	'<button type="button" class="btn btn-info editAddr">编辑</button>'+
							      	'<button type="button" class="btn btn-danger delAddr">删除</button>'+
							      '</td>'+
							    '</tr>';
					//插入数据到对应区域
					addressListID.insertAdjacentHTML('beforeEnd',cons);
		   		}
			},"json");
	}
	
	//初始化先执行一次
	addressList(currentPage,meetingAddress,addressStatus);
	
	//触犯翻页效果
	$('.pageLast').click(function(){
		var meetingAddress = $('.meetingAddress').val();
		var addressStatus = $('.addressStatus').val();
		if(currentPage>1){
			currentPage--;
		}
		$("#currentPage").val(currentPage);
		addressList(currentPage,meetingAddress,addressStatus);
	});
	$('.pageNext').click(function(){
		//取出总页数
		var totalPage = getCookie('totalPage');
		var meetingAddress = $('.meetingAddress').val();
		var addressStatus = $('.addressStatus').val();
		if(currentPage<totalPage){
			currentPage++;
		}else{
			currentPage = 1;
		}
		$("#currentPage").val(currentPage);
		addressList(currentPage,meetingAddress,addressStatus);
	});
	//页数跳转效果
	$('.goPage').click(function(){
		//取出总页数
		var totalPage = getCookie('totalPage');
		var meetingAddress = $('.meetingAddress').val();
		var addressStatus = $('.addressStatus').val();
		
		if(parnt.exec($("#currentPage").val())){
			currentPage=$("#currentPage").val();
			if(currentPage>totalPage||currentPage<1){
				currentPage=1;
			}
		}else{
			currentPage = 1;
		}
		$("#currentPage").val(currentPage);
		addressList(currentPage,meetingAddress,addressStatus);
	});
	//查询效果
	$('.addrSearch').click(function(){
		currentPage = 1;
		$("#currentPage").val(currentPage);
		var meetingAddress = $('.meetingAddress').val();
		var addressStatus = $('.addressStatus').val();
		addressList(currentPage,meetingAddress,addressStatus);
	});
	
	
	//新增地址功能dialog
	$(".addAddr").click(function(){
	    $("#addAddrDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
		
	});
	
	
	
	/*********新增地址确认传入数据增加用户*************/
	$('#addAddrSure').click(function(){
		var addAddrname = $('.addAddrname').val();
		var addAddrStatus = $('.addAddrStatus').val();
		var openTime = $('.openTime').val();
		var closeTime = $('.closeTime').val();
		
		if(addAddrname==''||addAddrStatus==''||openTime==''||closeTime==''){
			//增加用户时输入的数据存在空
			$('.addAddrAlert').text('添加地址失败,请输入完整信息!');
			$("#addAddrAlertDialog").modal({
		       show:true,
		       backdrop:'static',
		       keyboard:false
			});
			
		}else{
			if(openTime >= closeTime){
				$('.addAddrAlert').text('添加地址失败,开放时间应早于关闭时间!');
				$("#addAddrAlertDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
			}else{
				//判断全部合格然后可以传输数据进行插入用户数据
		    	$.post(ajaxsUrl+"addAddrServlet",{addAddrname:addAddrname,
		    	addAddrStatus:addAddrStatus,openTime:openTime,closeTime:closeTime,
		    	createUser:getCookie('name')},
			 	function(data){
				 	$('.addAddrAlert').text(data);
			    	$("#addAddrAlertDialog").modal({
				       show:true,
				       backdrop:'static',
				       keyboard:false
					});
				},"json");
			}
		}
	});
	/**********新增地址判断结束***********/
}