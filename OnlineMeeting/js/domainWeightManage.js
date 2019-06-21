window.onload=function(){
	$(".name").text(getCookie('name'));
	$(".roleName").text(getCookie('roleName'));
	var parnt = /^(0|[1-9][0-9]*)$/;
	var currentPage=$("#currentPage").val();
	var domainName = $('.domainName').val();
	
	function domainList(currentPage,domainName){
		$.post(ajaxsUrl+"domainWeigtManageServlet",{currentPage:currentPage,domainName:domainName},
			 function(data){
			 	//解析json
		   		var domains = data;
		   		domainListID=document.getElementById("domainList");
		   		domainListID.innerHTML='';
		   		/*设置条码*/
		   		var strLable = "共"+domains[0].totalPage+"页"+domains[0].totalRecord+"条记录";
		   		$("#logLable").html(strLable);
		   		setCookie('totalPage',domains[0].totalPage);
		   		/*开始分页*/
		   		var j = (currentPage-1)*5;
		   		for(var i=0;i<5;i++,j++){
		   			var cons = '<tr>'+
							      '<th scope="row">'+(j+1)+'</th>'+
							      '<td>'+domains[i].domainName+'</td>'+
							      '<td>'+domains[i].createName+'</td>'+
							      '<td>'+domains[i].createTime+'</td>'+
							      '<td>'+
							      	'<button type="button" class="btn btn-info editAddr">编辑</button>'+
							      	'<button type="button" class="btn btn-danger delAddr">删除</button>'+
							      '</td>'+
							    '</tr>';
					//插入数据到对应区域
					domainListID.insertAdjacentHTML('beforeEnd',cons);
		   		}
			},"json");
	}
	
	//初始化先执行一次
	domainList(currentPage,domainName);
	
	//触犯翻页效果：上一页
	$('.pageLast').click(function(){
		var domainName = $('.domainName').val();
		if(currentPage>1){
			currentPage--;
		}
		$("#currentPage").val(currentPage);
		domainList(currentPage,domainName);
	});
	//触犯翻页效果：下一页
	$('.pageNext').click(function(){
		//取出总页数
		var totalPage = getCookie('totalPage');
		var domainName = $('.domainName').val();
		if(currentPage<totalPage){
			currentPage++;
		}else{
			currentPage = 1;
		}
		$("#currentPage").val(currentPage);
		domainList(currentPage,domainName);
	});
	//页数跳转效果
	$('.goPage').click(function(){
		//取出总页数
		var totalPage = getCookie('totalPage');
		var domainName = $('.domainName').val();
		if(parnt.exec($("#currentPage").val())){
			currentPage=$("#currentPage").val();
			if(currentPage>totalPage||currentPage<1){
				currentPage=1;
			}
		}else{
			currentPage = 1;
		}
		$("#currentPage").val(currentPage);
		domainList(currentPage,domainName);
	});
	//查询效果
	$('.domainSearch').click(function(){
		currentPage = 1;
		$("#currentPage").val(currentPage);
		var domainName = $('.domainName').val();
		domainList(currentPage,domainName);
	});
	
	
	//新增地址功能dialog
	$(".addDomain").click(function(){
	    $("#addDomainDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
		
	});
	
	
	/*********新增地址确认传入数据增加用户*************/
	$('#addDomainSure').click(function(){
		var addDomainName = $('.addDomainName').val();
		if(addDomainName==''){
			//增加用户时输入的数据存在空
			$('.addDomainAlert').text('添加领域失败,请输入完整信息!');
			$("#addDomainAlertDialog").modal({
		       show:true,
		       backdrop:'static',
		       keyboard:false
			});
		}else{
			//判断全部合格然后可以传输数据进行插入用户数据
	    	$.post(ajaxsUrl+"addDomainServlet",{addDomainName:addDomainName,createUser:getCookie('name')},
		 	function(data){
			 	$('.addDomainAlert').text(data);
		    	$("#addDomainAlertDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
			},"json");
		}
	});
	/**********新增地址判断结束***********/
	
	
	
}