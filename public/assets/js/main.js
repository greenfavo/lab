$(document).ready(function() {
	if (window.location.search==='?login=false') {
		$("#loginModal").modal({
			keyboard:true
		})
	};
	
	$("#check").click(function(){
		if ($(this).attr('checked')) {
			$(this).removeAttr('checked');
		}else{
			$(this).attr('checked', 'checked');
		}
	});

	$('.hotpost_title').each(function(index, el) {
		var str=str_substr($(this).text(),17);
		$(this).text(str);
	});
	//获取评论作者名称第一个字作为头像
	$('.avatar').each(function(index, el) {
		var avatar=$(this).text()[0].toUpperCase();
		$(this).text(avatar);
	});
	
	//登录成功
	function logined(data){
		$(".unLogin").hide();
		$(".logined").show();
		$("#username").text(data.username);
	}

 	$.ajax({
 		url: '/login/username',
 		type: 'get',
 		success:function(data){
 			if (data.signal==='logined'){
 				logined(data);
 			}else{
 				console.log('未登录');
 			}
 		},
 		error:function(){
 			console.log('发生错误');
 		}
 	})

 	//打开登录框
	$('#loginbtn').click(function(event) {
		event.preventDefault();
		if ($(this).text()==='登录') {
			$("#loginModal").modal({
				keyboard:true
			})
		};
		
	});

	//登录提交
	$("#loginSubmit").click(function(){
 		var username=$("#user").val();
 		var password=$("#password").val();
 		var checked=$("#check").attr('checked');
 		var _this=$(this);
 		$.ajax({
 			url: '/login',
 			type: 'POST',
 			data: {
 				username:username,
 				password:password,
 				checked:checked
 			},
 			beforeSend:function(){
 				_this.attr('disabled', 'disabled').val('加载中...');
 			},
 			success:function(data){
 				_this.removeAttr('disabled').val('提交');
 				if (data.signal==='success') {
 					$("#loginModal").modal('hide')
 					logined(data);
 				}else{
 					$(".msg").text(data.signal).show();
 					$("#user,#password").val('');
 				}
 			},
 			error:function(){
 				alert("发生错误");
 			},
 			
 		});
 	});

	//注销登录
 	$("#out").click(function(){
 		$.get('/login/out', function(data) {
 			if (data.signal==='out') {
 				console.log("已退出");
 				$(".unLogin").show();
 				$(".logined").hide();
 			};
 		});
 	});

 	//提交评论
 	$('#commentBtn').click(function(){
 		var name=$('#name').val();
 		var email=$('#email').val();
 		var content=$('#content').val();
 		var postid=$('#postid').val();

 		if (content) {
 			$.post('/handleComments',
 				{name:name,email:email,content:content,postid:postid},function(data){
 					if (data.signal=='error') {
 						alert('发生错误');
 					}else if (data.signal=='success') {
 						alert('你的评论已提交成功，正在审核中...');
 					}else{
 						alert('提交失败');
 					}
 				});
 		}else{
 			alert('请填写评论内容');
 		}
 	});

 	//注册
 	var register={
 		regForm:function(){
			$("#regModal").modal({
				keyboard:true
			})
 		},
 		validate:function(){
 			var msg=$('.msg');
 			
 			var passwordReg=/^([a-z0-9]){6,}/i;//数字字母下划线,至少6位

 			//字母数字下划线连字符@字母数字下划线连字符.字母
 			var emailReg=/^([a-z0-9\_\-])+\@(([a-z0-9\_\-])+\.)+([a-z]{2,4})+$/i;
 			
 			var phoneReg=/^1\d{10}$/;//11位手机号正则

 			$('#regpassword').blur(function(){
 				if (passwordReg.test($(this).val())) {
 					msg.hide();
 				}else{
 					msg.show().text('密码至少6位，只能是数字字母下划线');
 					$(this).focus();
 				}
 			});

 			$('#email').blur(function(event) {
 				if (emailReg.test($(this).val())) {
 					msg.hide();
 				}else{
 					msg.show().text('邮箱格式错误，正确的格式为:tom12@163.com');
 					$(this).focus();
 				}
 			});

 			$('#phone').blur(function(){
 				if ($(this).val()) {
 					if (phoneReg.test($(this).val())) {
 						validated=1;
 						msg.hide();
 					}else{
 						validated=0;
 						$(this).focus();
 						msg.show().text('手机号码格式错误,请填写11位手机号')
 					}
 				}
 			});
 		},
 		handleReg:function(){
 			var username=$('#regname').val();
 			var trueName=$('#trueName').val();
 			var password=$('#regpassword').val();
 			var group=$('#group').val();
 			var email=$('#email').val();
 			var phone=$('#phone').val();
 			var msg=$('.msg');

 			if (!username||!trueName||!password||!group||!email) {
 				$('#regSubmit').attr('disabled', 'disabled');
 				msg.text('*为必填项,请填写完整信息');
 			}else{
 				$('#regSubmit').removeAttr('disabled');
 				$.ajax({
	 				url:'/register',
	 				type:'POST',
	 				data:{
	 					username:username,
	 					trueName:trueName,
	 					password:password,
	 					group:group,
	 					email:email,
	 					phone:phone
	 		
	 				},
	 				success:function(data){
	 					msg.show();
	 					if (data.signal==='success') {
	 						msg.text('提交成功，注册信息正在审核中...');
	 						setTimeout(function(){
	 							$('#regModal').modal('hide');
	 						},1000);
	 					}else if (data.signal==='用户名已存在') {
	 						msg.text('用户名被占用'); 						
	 					}else{
	 						msg.text('出错了！');
	 					}
	 				},
	 				error:function(){
	 					console.log('请求错误');
	 				}

	 			});
 			};
 			
 		}
 	};

 	$('#regbtn').click(register.regForm);
 	register.validate();
 	$('#regSubmit').click(register.handleReg);
 	
 	function str_substr(str,n){
    	if (str.length>n) {
    		str=str.substr(0,n)+"...";
    	};
    	return str;
    }

});
$(function() {
	$.ajax({
		url:'/recentComments',
		type:'get',
		success:function(data){
			var comments=data.comments;
			var articles=data.articles;
			var html='';
			for(var i in comments){
				for(var j in articles){
					if (comments[i].articleId==articles[j]._id) {
					    html+="<li>"+comments[i].time+"  "+comments[i].name;
						html+="在<a href='/article/"+articles[j]._id+"'>《"+articles[j].title+"》中说:</a>";
						html+=comments[i].content+"</li>";
					};
				}
			}
			$('.recentComments').append(html);
		},
		error:function(error){
			console.log('近期评论发生错误');
		}
	});
});
$(function() {
	$('#team').fullpage({
		 sectionsColor: ['#3AB5F3', '#1ECF90', '#68E6D0', '#5E3BE8'],
		 navigationColor:'#2FCDA8',
		 navigation:true,
		 navigationColor:'#2AEB88',
		 loopBottom:true,
		 anchors:['1','2','3','4'],
		 menu:true,
		 fixedElements: 'header,footer',
	});


});