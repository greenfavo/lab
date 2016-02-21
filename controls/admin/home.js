var models=require('../../models/models.js');

module.exports={
	home:function(req,res){
		if (req.session.username||req.signedCookies.username) {
			models.User.find({through:false},function(error,users){
				res.render('admin/home',{
					title:'仪表盘',
					username:req.session.username||req.signedCookies.username,
					users:users
				});
			});			
		}else{
			res.redirect(303,'/?login=false');
		}
	}
}