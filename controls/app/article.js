var models=require('../../models/models.js');
var format=require('../../middleware/format.js');
module.exports={
	home:function(req,res){//主页
		models.Article.find({},function(error,docs){
			if (error) {
				return console.error(error);
			}
			models.Article.find({},function(error,hotPosts){//热门文章
				if (error) {
					return console.log(error);
				};
				res.render('app/home',{
					title:'主页',
					docs:docs,
					hotPosts:hotPosts
				});
			}).sort({views:-1}).limit(5);

		}).sort({_id:-1});
	},
	detail:function(req,res){//文章详情页
		var id=req.params.id;
		var query=models.Article.findById(id);
		var username=null;
		if (req.session.username||req.signedCookies.username){
			username=req.session.username||req.signedCookies.username;
		}
		//mongoose必须有回调，不然不执行  $inc数字型自增自减
		models.Article.update(query,{$inc:{views:1}},function(error,callback){
			if (error) {
				console.log(error);
			}else{
				console.log(callback);
			}
		});

		query.exec(function(error,doc){
			if (error) {
				return console.error(error);
			}
			models.Article.find({},function(error,hotPosts){//热门文章
				if (error) {
					return console.log(error);
				};
				res.render('app/article',{
					title:doc.title,
					doc:doc,
					hotPosts:hotPosts,
					username:username,
				});
				
			}).sort({views:-1}).limit(5);			
		})
		
	},
	handleComments:function(req,res){
		var id=req.body.id;
		var name=req.body.name;
		var email=req.body.email;
		var content=req.body.content;
		var time=format().now;
		var role;

		if (name) {//如果有用户名则为游客
			role='visitor';
		}else{
			role='user';
			name=req.session.username||req.signedCookies.username;
			email='';
		}

		var comment={
			role:role,
			name:name,
			email:email,
			content:content,
			time:time
		}
		models.Article.update({_id:id},
			{$push:
				{
					'comments':comment
				}
			},function(error,result){
				if (error) return console.error(error);
				res.redirect(303,'/article/'+id);
		});
	}
	
}
