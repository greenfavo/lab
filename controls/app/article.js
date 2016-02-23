var models=require('../../models/models.js');
var format=require('../../middleware/format.js');
module.exports={
	home:function(req,res){//主页
		var pageSize=5;//每页文档数
		var currentPage=req.query.page||1;//当前页码

		models.Article.count({},function(error,count){//查询文章总数
			if (error) return console.error(error);

			var pageCount=Math.ceil(count/pageSize);//总页数
			currentPage=currentPage>pageCount? pageCount : currentPage;
			currentPage=currentPage<1? 1:currentPage;

			var skipNum=(currentPage-1)*pageSize;//跳过的文档数

			models.Article.find({},function(error,hotPosts){//热门文章
				if (error) return console.log(error);

				models.Article.find({},function(error,docs){
					if (error) return console.log(error);
					res.render('app/home',{
						title:'主页',
						docs:docs,
						hotPosts:hotPosts,
						pageCount:Array(pageCount),//因为swig for in循环必须是数组或对象
						currentPage:currentPage,
						url:''
					});

				}).limit(pageSize).skip(skipNum).sort({_id:-1});
				
			}).sort({views:-1}).limit(5);

		});
	},
	detail:function(req,res){//文章详情页
		var id=req.params.id;
		var query=models.Article.findById(id);
		var username=null;
		if (req.session.username||req.signedCookies.username){
			username=req.session.username||req.signedCookies.username;
		}
		//mongoose必须有回调，不然不执行  $inc数字型自增自减
		models.Article.update(query,{$inc:{views:1}},function(error){
			if (error) return console.error(error);
		});

		query.exec(function(error,doc){
			if (error) {
				return console.error(error);
			}
			models.Article.find({},function(error,hotPosts){//热门文章
				if (error) {
					return console.log(error);
				};
				models.Comment.find({articleId:id,through:true},function(error,comments){
					res.render('app/article',{
						title:doc.title,
						doc:doc,
						hotPosts:hotPosts,
						username:username,
						comments:comments
					});
				}).limit(10).sort({time:-1});
								
			}).sort({views:-1}).limit(5);			
		})
		
	},
	handleComments:function(req,res){//评论处理
		var id=req.body.postid;
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
			time:time,
			articleId:id,
		}
		models.Comment.create(comment,function(error){
			if (error){
				res.json({
					signal:'error'
				});
			}else{
				res.json({
					signal:'success'
				});
			}				
		});
	},
	recentComments:function(req,res){
		models.Comment.find({through:true},function(error,comments){
			if (error) return console.error(error);

			models.Article.find({},function(error,articles){
				if (error) return console.error(error);

				res.json({
					comments:comments,
					articles:articles
				});
			});
		}).limit(5).sort({_id:-1});
	},
	
}
