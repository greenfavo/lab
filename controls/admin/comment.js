var models=require('../../models/models.js');
module.exports={
	comment:function(req,res){
		if (req.session.username||req.signedCookies.username){
			var pageSize=5;//每页文档数
			var currentPage=req.query.page||1;//当前页码

			models.Comment.count({},function(error,count){
				if (error) return console.error(error);

				var pageCount=Math.ceil(count/pageSize);//总页数
				currentPage=currentPage>pageCount? pageCount:currentPage;
				currentPage=currentPage<1? 1:currentPage;
				var skipNum=(currentPage-1)*pageSize;

				models.Comment.find({},function(error,comments){
					if (error) return console.error(error);
					
					models.Article.find({},function(error,docs){
						res.render('admin/comment',{
							title:'评论管理',
							username:req.session.username||req.signedCookies.username,
							comments:comments,
							docs:docs,
							pageCount:Array(pageCount),//因为swig for in循环必须是数组或对象
							currentPage:currentPage,
							url:'/admin/comment'
						});
					});
				}).limit(pageSize).skip(skipNum).sort({through:1});
			});
			
		}else{
			res.redirect(303,'/?login=false');
		}
	},
	through:function(req,res){//审核通过
		var id=req.query.id;
		var url=req.headers['referer'];
		models.Comment.update({_id:id},{$set:{through:true}},function(error,callback){
			if (error) return console.error(error);
			res.redirect(303,url);
		});
	},
	delete:function(req,res){
		var id=req.query.id;
		var url=req.headers['referer'];
		models.Comment.remove({_id:id},function(error){
			if (error) return console.error(error);
			res.redirect(303,url);
		});
	},
	deleteSelected:function(req,res){//批量删除
		var ids=req.body.commentid;
		var url=req.headers['referer'];

		var query=models.Comment.where('_id').in(ids);
		models.Comment.remove(query,function(error,callback){
			if (error) return console.error(error);
			res.redirect(303,url);
		});
	}
}