var questionnaireAdd = new Array();

var currentPage=$("#currentPage").val();
var currentPage1=$("#currentPage1").val();
var questionnaireName = $('.questionnaireName').val();
var createTime = $('.createTime').val();
var questionName = $('.questionName').val();
var questionType = $('.questionType').val();
var createUser = $('.createUser').val();
window.onload=function(){
	$(".name").text(getCookie('name'));
	$(".roleName").text(getCookie('roleName'));
	var parnt = /^(0|[1-9][0-9]*)$/;
	
	//简单的列出问卷
	function questionnaireList(currentPage,questionnaireName,createTime){
		$.post(ajaxsUrl+"questionnaireServlet",{currentPage:currentPage,questionnaireName:questionnaireName,
			createTime:createTime},
			 function(data){
			 	//解析json
		   		var questionnaire = data;
		   		questionnaireListID=document.getElementById("questionnaireList");
		   		questionnaireListID.innerHTML='';
		   		/*设置条码*/
		   		var strLable = "共"+questionnaire[0].totalPage+"页"+questionnaire[0].totalRecord+"条记录";
		   		$("#logLable").html(strLable);
		   		setCookie('totalPage',questionnaire[0].totalPage);
		   		/*开始分页*/
		   		var j = (currentPage-1)*5;
		   		for(var i=0;i<5;i++,j++){
		   			var cons = '<tr>'+
							      '<th scope="row">'+(j+1)+'</th>'+
							      '<td>'+questionnaire[i].questionnaireName+'</td>'+
							      '<td>'+questionnaire[i].createUser+'</td>'+
							      '<td>'+questionnaire[i].createTime+'</td>'+
							      '<td>'+
							      	'<button type="button" onclick="lookQuestionnaire(\''+questionnaire[i].questionnaireName+'\',\''+questionnaire[i].questionnaireID+'\')" class="btn btn-success">预览</button>'+
							      	'<button type="button" class="btn btn-warning">编辑</button>'+
							      	'<button type="button" class="btn btn-danger">删除</button>'+
							      '</td>'+
							    '</tr>';
					//插入数据到对应区域
					questionnaireListID.insertAdjacentHTML('beforeEnd',cons);
		   		}
			},"json");
	}
	//简单的列出问题
	function questionList(currentPage1,questionName,questionType,createUser){
		$.post(ajaxsUrl+"questionServlet",{currentPage1:currentPage1,questionName:questionName,
			questionType:questionType,createUser:createUser},
			 function(data){
			 	//解析json
		   		var question = data;
		   		questionListID=document.getElementById("questionList");
		   		questionListID.innerHTML='';
		   		/*设置条码*/
		   		var strLable = "共"+question[0].totalPage+"页"+question[0].totalRecord+"条记录";
		   		$("#logLable1").html(strLable);
		   		setCookie('totalPage1',question[0].totalPage);
		   		/*开始分页*/
		   		var j = (currentPage1-1)*5;
		   		for(var i=0;i<5;i++,j++){
		   			var cons = '<tr>'+
							      '<th scope="row">'+(j+1)+'</th>'+
							      '<td>'+question[i].questionName+'</td>'+
							      '<td>'+question[i].questionType+'</td>'+
							      '<td>'+question[i].createUser+'</td>'+
							      '<td>'+question[i].createTime+'</td>'+
							      '<td>'+question[i].updateTime+'</td>'+
							      '<td>'+
							      	'<button type="button" class="btn btn-warning">编辑</button>'+
							      	'<button type="button" class="btn btn-danger">删除</button>'+
							      '</td>'+
							    '</tr>';
					//插入数据到对应区域
					questionListID.insertAdjacentHTML('beforeEnd',cons);
		   		}
			},"json");
	}
	
	//初始化先执行一次
	questionnaireList(currentPage,questionnaireName,createTime);
	
	/**************第一部分****************/
	//触犯翻页效果
	$('.pageLast').click(function(){
		var questionnaireName = $('.questionnaireName').val();
		var createTime = $('.createTime').val();
		if(currentPage>1){
			currentPage--;
		}
		$("#currentPage").val(currentPage);
		questionnaireList(currentPage,questionnaireName,createTime);
	});
	$('.pageNext').click(function(){
		//取出总页数
		var totalPage = getCookie('totalPage');
		var questionnaireName = $('.questionnaireName').val();
		var createTime = $('.createTime').val();
		if(currentPage<totalPage){
			currentPage++;
		}else{
			currentPage = 1;
		}
		$("#currentPage").val(currentPage);
		questionnaireList(currentPage,questionnaireName,createTime);
	});
	//页数跳转效果
	$('.goPage').click(function(){
		//取出总页数
		var totalPage = getCookie('totalPage');
		var questionnaireName = $('.questionnaireName').val();
		var createTime = $('.createTime').val();
		
		if(parnt.exec($("#currentPage").val())){
			currentPage=$("#currentPage").val();
			if(currentPage>totalPage||currentPage<1){
				currentPage=1;
			}
		}else{
			currentPage = 1;
		}
		$("#currentPage").val(currentPage);
		questionnaireList(currentPage,questionnaireName,createTime);
	});
	//查询效果
	$('.questionnaireSearch').click(function(){
		currentPage = 1;
		$("#currentPage").val(currentPage);
		var questionnaireName = $('.questionnaireName').val();
		var createTime = $('.createTime').val();
		questionnaireList(currentPage,questionnaireName,createTime);
	});
	
	
	//新增地址功能dialog
	$(".addQuestionnaire").click(function(){
	    $("#addQuestionnairDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
		
		var currentPageAdd=1;
		var questionNameAdd=$('.Questionname').val();
		function addQuetionnaire(currentPageAdd,questionNameAdd){
			$.post(ajaxsUrl+"questionServlet",{currentPage1:currentPageAdd,questionName:questionNameAdd,
			questionType:'',createUser:''},
				 function(data){
				 	//解析json
			   		var question = data;
			   		questionListAddID=document.getElementById("questionListAdd");
			   		questionListAddID.innerHTML='';
			   		/*设置条码*/
			   		/*开始分页*/
			   		setCookie('totalPageAdd',question[0].totalPage);
			   		var j = (currentPageAdd-1)*5;
			   		for(var i=0;i<5;i++,j++){
			   			var cons =  '<tr>'+
			   							'<td>'+(j+1)+'</td>'+
								  	    '<td>'+
								  			'<input type="checkbox" value=\''+question[i].questionID+'\' class="myCheckAdd" id="myCheck'+i+'">'+
	    									'<label for="myCheck'+i+'"></label>'+
								  		'</td>'+
								  		'<td>'+question[i].questionName+'</td>'+
								  	'</tr>';
						//插入数据到对应区域
						questionListAddID.insertAdjacentHTML('beforeEnd',cons);
			   		}
				},"json");
		}
		addQuetionnaire(currentPageAdd,questionNameAdd);
		
		$('.QuestionnameSearch').click(function(){
			questionNameAdd=$('.Questionname').val();
			currentPageAdd = 1;
			addQuetionnaire(currentPageAdd,questionNameAdd);
		});
		//触犯翻页效果
		$('.pageLastAdd').click(function(){
			questionNameAdd=$('.Questionname').val()
			if(currentPageAdd>1){
				currentPageAdd--;
			}
			addQuetionnaire(currentPageAdd,questionNameAdd);
		});
		$('.pageNextAdd').click(function(){
			//取出总页数
			var totalPage = getCookie('totalPageAdd');
			questionNameAdd=$('.Questionname').val()
			if(currentPageAdd<totalPage){
				currentPageAdd++;
			}else{
				currentPageAdd = 1;
			}
			addQuetionnaire(currentPageAdd,questionNameAdd);
		});
		
		//点击添加按钮后添加人员到数组里面
		$('.QuestionnameAdd').click(function(){
			//先将选中的所有人员加到JOSN数组里面
			var questionListCheck = $('#questionListAdd input');
			for(var i=0;i<questionListCheck.length;i++){
				if(questionListCheck[i].checked==true){
					var questionID = questionListCheck[i].value;
					var question = {'questionID':questionID};
					//若participants不为空则时去循环找一下有咩有重复人员，防止重复添加相同人员
					if(questionnaireAdd.length==0){//判断是因为第一次肯定为空,后面不为空的时候再遍历查看
						questionnaireAdd.push(question);
					}else{
						var isExistflag = 0;
						for(var j=0;j<questionnaireAdd.length;j++){
							if(questionnaireAdd[j].questionID == question.questionID){
								isExistflag=1;
								break;
							}
						}
						if(isExistflag==0){
							questionnaireAdd.push(question);
						}
					}
				}
			}
			//添加完人员后在把选中的人放到右边
			questionIDListID=document.getElementById("questionIDList");
			questionIDListID.innerHTML='';
			for(var i=0;i<questionnaireAdd.length;i++){
		   		var cons =  '<li>'+
		        				'<button type="button" onclick="delQuestion(this)" class="btn btn-warning">'+questionnaireAdd[i].questionID+'</button>'+
		        			'</li>';
				//插入数据到对应区域
				questionIDListID.insertAdjacentHTML('beforeEnd',cons);
		   }
		});
		
		
	});
	
	/*********新增问卷确认传入数据增加问卷*************/
	$('#addQuestionnairSure').click(function(){
		var addQuestionnairename = $('.addQuestionnairename').val();
		
		if(questionnaireAdd.length<5 || addQuestionnairename==''){
			$('.addAlert').text('创建问卷失败,问卷问题数必须大于5个,且问卷名不能为空!');
		    $("#addAlertDialog").modal({
	      	 	show:true,
	       		backdrop:'static',
	       		keyboard:false
			});
		}else{
			//问题全部选完后开始传送数据到后端
			//判断全部合格然后可以传输数据进行插入用户数据
	    	$.post(ajaxsUrl+"addQuestionnaireServlet",{questionnaireID:JSON.stringify(questionnaireAdd),
	    	questionnaireName:addQuestionnairename,createUser:getCookie('name')},
		 	function(data){
			 	$('.addAlert1').text(data);
			    $("#addAlertDialog1").modal({
		      	 	show:true,
		       		backdrop:'static',
		       		keyboard:false
				});
			},"json");
		}
	});
	/**********新增问卷结束***********/
	
	
	/**************第二部分****************/
	questionList(currentPage1,questionName,questionType,createUser);
	//触犯翻页效果
	$('.pageLast1').click(function(){
		var questionName = $('.questionName').val();
		var questionType = $('.questionType').val();
		var createUser = $('.createUser').val();
		if(currentPage1>1){
			currentPage1--;
		}
		$("#currentPage1").val(currentPage1);
		questionList(currentPage1,questionName,questionType,createUser);
	});
	$('.pageNext1').click(function(){
		//取出总页数
		var totalPage = getCookie('totalPage1');
		var questionName = $('.questionName').val();
		var questionType = $('.questionType').val();
		var createUser = $('.createUser').val();
		if(currentPage1<totalPage){
			currentPage1++;
		}else{
			currentPage1 = 1;
		}
		$("#currentPage1").val(currentPage1);
		questionList(currentPage1,questionName,questionType,createUser);
	});
	//页数跳转效果
	$('.goPage1').click(function(){
		//取出总页数
		var totalPage = getCookie('totalPage1');
		var questionName = $('.questionName').val();
		var questionType = $('.questionType').val();
		var createUser = $('.createUser').val();
		
		if(parnt.exec($("#currentPage1").val())){
			currentPage1=$("#currentPage1").val();
			if(currentPage1>totalPage||currentPage1<1){
				currentPage1=1;
			}
		}else{
			currentPage1 = 1;
		}
		$("#currentPage1").val(currentPage1);
		questionList(currentPage1,questionName,questionType,createUser);
	});
	//查询效果
	$('.questionSearch').click(function(){
		currentPage1 = 1;
		$("#currentPage1").val(currentPage1);
		var questionName = $('.questionName').val();
		var questionType = $('.questionType').val();
		var createUser = $('.createUser').val();
		questionList(currentPage1,questionName,questionType,createUser);
	});
	
	
	//新增地址功能dialog
	$(".addQuestion").click(function(){
	    $("#addQuestionDialog").modal({
	       show:true,
	       backdrop:'static',
	       keyboard:false
		});
		
	});
	
	
	
	/*********新增问题确认传入数据增加用户*************/
	$('#addQuestionSure').click(function(){
		var question={};
		var addQuestionName = $('.addQuestionName').val();
		var addQuestionType = $('.addQuestionType').val();
		var selectA;
		var selectB;
		var selectC;
		var selectD;
		var selectE;
		var answer;
		if(addQuestionType=='单选'){
			selectA = $('#collapseSelect .selectA').val();
			selectB = $('#collapseSelect .selectB').val();
			selectC = $('#collapseSelect .selectC').val();
			selectD = $('#collapseSelect .selectD').val();
			answer = $('.selectAnswer').val();
			if(selectA==''||selectB==''||selectC==''||
			selectD==''||addQuestionName==''||answer==''){
				//增加问题时输入的数据存在空
				$('.addAlert').text('添加单选题失败,请输入完整信息!');
				$("#addAlertDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
			}else{
				question = {
					'questionName':addQuestionName,
					'questionKey':answer,
					'questionType':addQuestionType,
					'selectA':selectA,
					'selectB':selectB,
					'selectC':selectC,
					'selectD':selectD
				};
			}
			/********单选题添加信息到quesiton完成********/
		}else if(addQuestionType=='多选'){
			selectA = $('#collapseDoubleSelect .selectA').val();
			selectB = $('#collapseDoubleSelect .selectB').val();
			selectC = $('#collapseDoubleSelect .selectC').val();
			selectD = $('#collapseDoubleSelect .selectD').val();
			selectE = $('#collapseDoubleSelect .selectE').val();
			answer = doubleSelect();
			if(selectA==''||selectB==''||selectC==''||
			selectD==''||selectE==''||addQuestionName==''||answer==''){
				//增加问题时输入的数据存在空
				$('.addAlert').text('添加多选题失败,请输入完整信息!');
				$("#addAlertDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
			}else{
				question = {
					'questionName':addQuestionName,
					'questionKey':answer,
					'questionType':addQuestionType,
					'selectA':selectA,
					'selectB':selectB,
					'selectC':selectC,
					'selectD':selectD,
					'selectD':selectE,
				};
			}
			/********多选题添加信息到quesiton完成********/
		}else{
			if(addQuestionName==''||$('.answerShort').val()==''){
				//增加问题时输入的数据存在空
				$('.addAlert').text('添加简答题失败,请输入完整信息!');
				$("#addAlertDialog").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
			}else{
				question = {
					'questionName':addQuestionName,
					'questionKey':$('.answerShort').val(),
					'questionType':addQuestionType,
				};
			}
		}
		
		if(JSON.stringify(question) != "{}"){
			//判断全部合格然后可以传输数据进行插入用户数据
	    	$.post(ajaxsUrl+"addQuestionServlet",{question:JSON.stringify(question),
	    	createUser:getCookie('name')},
		 	function(data){
			 	$('.addAlert1').text(data);
		    	$("#addAlertDialog1").modal({
			       show:true,
			       backdrop:'static',
			       keyboard:false
				});
			},"json");
		}
	});
	/**********新增地址判断结束***********/
}
$(".optionL").click(function(){
	//点左边，显示左边，隐藏右边
	$(".body-content-right").css("display","none");
	$(".body-content-left").css("display","inline-block");
});
$(".optionR").click(function(){
	//点右边，显示右边，隐藏左边
	$(".body-content-left").css("display","none");
	$(".body-content-right").css("display","inline-block");
});


/*************对添加的问卷点击删除功能************/
//自定义移除participants中带ID的JSON对象
function questionnaireAddRemove(questionID){
	for(var i=0;i<questionnaireAdd.length;i++){
		if(questionnaireAdd[i].questionID == questionID){
			questionnaireAdd.splice(i,1);
		}
	}
}

//点击删除事件
function delQuestion(thisObj){
	var btnArray = ['确认', '取消'];
	var elem = thisObj;
	var li = elem.parentNode;
	var ul = elem.parentNode.parentNode;
	var questionID = $(elem).text();
	mui.confirm('确认移除该问题吗？','Hello',btnArray,function(e){
		if(e.index == 0){
			questionnaireAddRemove(questionID);
			ul.removeChild(li);
		}
	});
}
/*********添加问题事件**********/
//给选择问题类型加事件
function checkSelect(){
	var questionType = $(".addQuestionType").val();
	if(questionType=='简答'){
		$('#collapseSelect').css('display','none');
		$('#collapseDoubleSelect').css('display','none');
		$('#collapseShort-answer').css('display','inline');
	}else if(questionType=='多选'){
		$('#collapseSelect').css('display','none');
		$('#collapseShort-answer').css('display','none');
		$('#collapseDoubleSelect').css('display','inline');
	}else{
		$('#collapseShort-answer').css('display','none');
		$('#collapseDoubleSelect').css('display','none');
		$('#collapseSelect').css('display','inline');
	}
}
//多选看答案选了哪些
function doubleSelect(){
	var mutilSelect='';
	//先将选中的选项加到答案中
	var answerListCheck = $('.selectDoubleAnswer input');
	for(var i=0;i<answerListCheck.length;i++){
		if(answerListCheck[i].checked==true){
			mutilSelect = mutilSelect+answerListCheck[i].value;
		}
	}
	return mutilSelect;
}
/************预览问卷*****************/
function lookQuestionnaire(questionnaireName,questionnaireID){
	$('.lookQuestionnaireName').text(questionnaireName);
	$.post(ajaxsUrl+"lookQuestionnaireServlet",{questionnaireID:questionnaireID},
			 function(data){
			 	//解析json
		   		var question = data;
		   		lookQuestionnaireListID=document.getElementById("lookQuestionnaireList");
		   		lookQuestionnaireListID.innerHTML='';
		   		for(var i=0;i<question.length;i++){
		   			var cons='';
		   			if(question[i].questionType=='单选'){
		   				cons = 	'<li class="list-group-item">'+
								    '<div class="row questionTitle">'+
								      	'<span>'+(i+1)+'.'+question[i].questionName+'</span>'+
								    '</div>'+
								    '<div class="row questionSelect">'+
								      	'<span>A.'+question[i].selectA+'</span>'+
								      	'<span>B.'+question[i].selectB+'</span>'+
								      	'<span>C.'+question[i].selectC+'</span>'+
								      	'<span>D.'+question[i].selectD+'</span>'+
								    '</div>'+
								    '<div class="row questionSelect">'+
								      	'<span>答案：'+question[i].questionKey+'<span>'+
								    '</div>'+
								'</li>';
						
		   			}else if(question[i].questionType=='多选'){
		   				cons = 	'<li class="list-group-item">'+
								    '<div class="row questionTitle">'+
								      	'<span>(多选)'+(i+1)+'.'+question[i].questionName+'</span>'+
								    '</div>'+
								    '<div class="row questionSelect">'+
								      	'<span>A.'+question[i].selectA+'</span>'+
								      	'<span>B.'+question[i].selectB+'</span>'+
								      	'<span>C.'+question[i].selectC+'</span>'+
								      	'<span>D.'+question[i].selectD+'</span>'+
								      	'<span>E.'+question[i].selectE+'</span>'+
								    '</div>'+
								    '<div class="row questionSelect">'+
								      	'<span>答案：'+question[i].questionKey+'<span>'+
								    '</div>'+
								'</li>';
								
		   			}else if(question[i].questionType=='简答'){
		   				cons = 	'<li class="list-group-item">'+
								    '<div class="row questionTitle">'+
								      	'<span>(多选)'+(i+1)+'.'+question[i].questionName+'</span>'+
								    '</div>'+
								    '<div class="row questionSelect">'+
								      	'<span>答案：'+question[i].questionKey+'<span>'+
								    '</div>'+
								'</li>';
		   			}
		   			//插入数据到对应区域
					lookQuestionnaireListID.insertAdjacentHTML('beforeEnd',cons);
		   		}
			},"json");
	//把所有数据渲染好以后显示
	$("#lookQuestionnairDialog").modal({
       show:true,
       backdrop:'static',
       keyboard:false
	});
}