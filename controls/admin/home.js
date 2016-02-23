var models=require('../../models/models.js');

module.exports={
	home:function(req,res){
		if (req.session.username||req.signedCookies.username) {
			models.User.find({through:false},function(error,users){
				
				models.Comment.find({through:false},function(error,comments){
					if (error) return console.error(error);

					models.Article.find({},function(error,docs){
						if (error) return console.error(error);

						res.render('admin/home',{
							title:'仪表盘',
							username:req.session.username||req.signedCookies.username,
							users:users,
							docs:docs,
							comments:comments
						});
					});
				});
				
			});			
		}else{
			res.redirect(303,'/?login=false');
		}
	},
}