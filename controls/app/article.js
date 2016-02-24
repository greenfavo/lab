var models=require('../../models/models.js');
var format=require('../../middleware/format.js');
var flow=require('nimble');//异步流程控制工具
module.exports={
	home:function(req,res){//主页
		var currentPage=req.query.page||1;//当前页码
		var docs,hotPosts,skipNum,pageCount,pageSize=1; 
		flow.series([//串行
			function(callback){//查询总数
				models.Article.count({},function(error,count){
					if (error) return console.error(error);

					pageCount=Math.ceil(count/pageSize);//总页数
					currentPage=currentPage>pageCount? pageCount : currentPage;
					currentPage=currentPage<1? 1:currentPage;
					skipNum=(currentPage-1)*pageSize;//跳过的文档数

					callback();
				});
			},
			function(callback){
				flow.parallel([//并行
					function(callback){//分页
						models.Article.find({},function(error,result){
							if (error) return console.error(error);							

							docs=result;
							callback();
							
						}).skip(skipNum).limit(pageSize).sort({_id:-1});
					},
					function(callback){//热门文章
						models.Article.find({},function(error,result){
							if (error) return console.error(error);

							hotPosts=result;
							callback();
						}).limit(5).sort({views:-1});
					}
				],callback);
			},
			function(callback){//渲染
				res.render('app/home',{
					title:'主页',
					docs:docs,
					hotPosts:hotPosts,
					pageCount:Array(pageCount),//因为swig for in循环必须是数组或对象
					currentPage:currentPage,
					url:''
				});

				callback();
			}
		]);
	},
	detail:function(req,res){//文章详情页
		var id=req.params.id;
		var username=null;
		var doc,hotPosts,comments;
		var query=models.Article.findById(id);
		if (req.session.username||req.signedCookies.username){
			username=req.session.username||req.signedCookies.username;
		}

		flow.series([
			function(callback){//浏览量更新
				//mongoose必须有回调，不然不执行  $inc数字型自增自减
				models.Article.update(query,{$inc:{views:1}},function(error){
					if (error) return console.error(error);

					callback();
				});

			},
			function(callback){
				flow.parallel([
					function(callback){//查询单个文档
						query.exec(function(error,result){
							if (error) return console.error(error);

							doc=result;
							callback();
						});
					},
					function(callback){//热门文章
						models.Article.find({},function(error,result){
							if (error) return console.error(error);

							hotPosts=result;
							callback();
						}).limit(5).sort({views:-1});
					},
					function(callback){//查询评论
						models.Comment.find({articleId:id,through:true},function(error,result){
							if (error) return console.error(error);

							comments=result;
							callback();
						}).limit(10).sort({time:-1});
					}

				],callback);
			},
			function(callback){//集中渲染
				res.render('app/article',{
					title:doc.title,
					doc:doc,
					hotPosts:hotPosts,
					username:username,
					comments:comments
				});
				callback();
			}
		]);
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
