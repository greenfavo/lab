var models=require('../../models/models.js');
module.exports={
	login:function(req,res){//登录验证
		var username=req.body.username;
		var password=req.body.password;
		var checked=req.body.checked;

		models.User.find({userName:username,password:password},function(error,users){
			if (error) return console.error(error);
			if (users.length) {
				if (checked) {
					res.cookie('username',username,{
						signed:true,
						httpOnly:true,//只能由服务器修改，客户端不能修改
						maxAge:60*60*24*7*1000//一周内自动登录
					});
				};
				req.session.username=username;

				res.json({
					signal:'success',
					username:username
				});
			}else{
				console.log('用户名或密码错误');
				res.json({
					signal:'用户名或密码错误'
				})
			}
		})
	},
	logined:function(req,res){//已登录处理
		if (req.session.username!=null||req.signedCookies.username!=null){
			res.json({
				signal:'logined',
				username:req.session.username||req.signedCookies.username
			});
		}else{
			console.log('没有登录');
		}
	},
	loginOut:function(req,res){//退出登录
		req.session.username=null;
		res.clearCookie('username');
		res.json({
			signal:'out'
		});
		console.log("cookie是"+req.signedCookies.username);
		console.log("session是"+req.session.username);
	}
}