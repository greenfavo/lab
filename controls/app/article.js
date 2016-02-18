var models=require('../../models/models.js');
module.exports={
	home:function(req,res){//主页
		models.Article.find({},function(error,docs){
			if (error) {
				console.error(error);
			}else{
				res.render('app/home',{
					title:'新思路团队官网',
					docs:docs
				});
			}
		}).sort({_id:-1});
	},
	detail:function(req,res){//文章详情页
		var id=req.params.id;
		console.log('id是'+id);
		models.Article.findById(id,function(error,doc){
			if (error) {
				res.send(error);
			}else if (!doc) {
				res.render('404',{title:'404'});
			}else{
				res.render('app/article',{
					title:doc.title,
					doc:doc,
				});
				doc.views++;
				console.log(doc.views);

				models.Article.update({_id:id},{$set:{views:doc.views}});
			}
		});
	}
}