var models=require('../../models/models.js');
module.exports={
	handleReg:function(req,res){
		var username=req.body.username;
		var trueName=req.body.trueName;
		var password=req.body.password;
		var group=req.body.group;
		var email=req.body.email;
		var phone=req.body.phone;

		var doc={//实例化数据模型
			userName:username,
			trueName:trueName,
			password:password,
			group:group,
			email:email,
			phone:phone
		};

		models.User.find({userName:username},function(error,users){
			if (error) return console.error(error);
			if (users.length) {
				res.json({
					signal:'用户名已存在',
					username:username
				});
			}else{
				models.User.create(doc,function(error){
					if (error){
						console.error(error);
					}else{
						console.log('注册成功');
						res.json({
							signal:'success',
							username:username
						})
					}

				});
			}
		});
	},




}