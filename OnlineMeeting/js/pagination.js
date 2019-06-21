//定义有关分页的全局变量
var pageNum = 1; //当前页
var pageSize = 5; //每页显示的数据
var pages = 10 ; //总页数
var total = 100 ; //总数据数
var navigatepageSize = 5; //分页导航显示的页码数
var navigatepageNums = []; //当前页码导航
/**
注意:如果有搜索功能，记得在搜索的时候将pageNum,navigatepageSize,navigatepageNums重置；
在pages小于navigatepageSize时，有多少page就显示多少格分页导航，navigatepageSize=pages；
在pages<=1 时就不要显示分页导航了,没用
*/
 
 //初始化页码导航数组
setNavigatepageNums(pageNum, navigatepageSize);
//初始化分页导航
initMuiPagination();

/**
*导航页码赋值,min为最小数值，size为数组大小
*/
function setNavigatepageNums(min, navigatepageSize){
	for(var i=0; i<navigatepageSize; i++){
		navigatepageNums[i] = min;
		min++;
	}
}
//初始化分页导航
function initMuiPagination(){
	var table = document.getElementById("pagination");
	var html = "";
	html += '<li class="mui-previous mui-disabled"><a href="#">&laquo;</a></li>';
	html += '<li class="mui-active"><a href="#">'+pageNum+'</a></li>';
	for(var i=1; i<navigatepageSize; i++){
		html += '<li><a href="#">'+(pageNum+i)+'</a></li>';
	}
	html += '<li class="mui-next"><a href="#">&raquo;</a></li>';
	table.innerHTML = html;
}
	
mui.init({
	swipeBack:true //启用右滑关闭功能
});
(function($) {
	$('.mui-pagination').on('tap', 'a', function() {
		var li = this.parentNode;
		var classList = li.classList;
		console.log(classList);
		if (!classList.contains('mui-active') && !classList.contains('mui-disabled')) {
			var active = li.parentNode.querySelector('.mui-active');
			if (classList.contains('mui-previous')) {//previous
				if (active) {
					var previous = active.previousElementSibling;
					var flagPrevious = navigatepageNums.indexOf(pageNum-1);
					if(pageNum>1 && flagPrevious<0){
						var table = document.body.querySelector('.mui-pagination');
						var html = ""; 
						if(pageNum == 2){
							html += '<li class="mui-previous mui-disabled"><a href="#">&laquo;</a></li>';
						} else {
							html += '<li class="mui-previous"><a href="#">&laquo;</a></li>';
						}
						html += '<li class="mui-active"><a href="#">'+(pageNum-1)+'</a></li>';
						for(var i=0; i<navigatepageSize-1; i++){
							html += '<li><a href="#">'+(pageNum+i)+'</a></li>';
						}
						html += '<li class="mui-next"><a href="#">&raquo;</a></li>';
						table.innerHTML = html;
						//重设导航页码数组
						setNavigatepageNums(pageNum-1,navigatepageSize);
						pageNum--;
					}
					if(pageNum>1){
						if(previous){
							$.trigger(previous.querySelector('a'), 'tap');
						}
					} else{
						classList.add('mui-disabled');
					}
					
				}
			} else if (classList.contains('mui-next')) {//next
				if (active) {
					var next = active.nextElementSibling;
					console.log("pageNum:"+pageNum+";pages:"+pages);
					//判断下一页的页码在不在导航页码数组里
					var flagNext = navigatepageNums.indexOf(pageNum+1);
					//当前页在最后，且还有下一页，且下一页不在当前显示的导航页码里
					if(pageNum>=navigatepageSize && pageNum<pages && flagNext<0){
						var table = document.body.querySelector('.mui-pagination');
						var html = ""; 
						html += '<li class="mui-previous"><a href="#">&laquo;</a></li>';
						for(var i=navigatepageSize-2; i>=0; i--){
							html += '<li><a href="#">'+(pageNum-i)+'</a></li>';
						}
						html += '<li class="mui-active"><a href="#">'+(pageNum+1)+'</a></li>';
						if(pageNum == pages-1){
							html += '<li class="mui-next mui-disabled"><a href="#">&raquo;</a></li>';
						} else{
							html += '<li class="mui-next"><a href="#">&raquo;</a></li>';
						}
						table.innerHTML = html;
						//重设导航页码数组
						setNavigatepageNums(pageNum-navigatepageSize+2,navigatepageSize);
						pageNum++;
					}
					if (pageNum < pages){
						if(next){
							$.trigger(next.querySelector('a'), 'tap');
						}
					}else {
						classList.add('mui-disabled');
					}
					
				}
			} else {//page
				active.classList.remove('mui-active');
				classList.add('mui-active');
				var page = parseInt(this.innerText); //当前页
				pageNum = page; //当前页
				var previousPageElement = li.parentNode.querySelector('.mui-previous'); //上一页按钮
				var nextPageElement = li.parentNode.querySelector('.mui-next'); //下一页按钮
				previousPageElement.classList.remove('mui-disabled');
				nextPageElement.classList.remove('mui-disabled');
				if (page <= 1) {
					previousPageElement.classList.add('mui-disabled');
				} else if (page >= pages) {
					nextPageElement.classList.add('mui-disabled');
				} 
			}
		}
	});
})(mui);