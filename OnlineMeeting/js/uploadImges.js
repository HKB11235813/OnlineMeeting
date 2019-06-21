$('#fileClick').on('change',function(){
    // 如果没有选择图片 直接退出
    if(this.files.length <=0){
    	alert(222);
        return false;
    }
    // 图片上传到服务器
    var pic1 = this.files[0];
    var formData = new FormData();
    // 服务端要求参数是 pic1 
   $.post(ajaxsUrl+"uploadServlet",{formData:formData,userID:getCookie('userID')},
   function(data){
        	console.log(data);
            // 设置图片预览功能
            $('#titleImg img').attr('src',data.picAddr);
        }
    })
});