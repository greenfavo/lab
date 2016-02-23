var models=require('../../models/models.js');
module.exports={
	user:function(req,res){
		if (req.session.username||req.signedCookies.username){
			var pageSize=5;//每页文档数
			var currentPage=req.query.page||1;//当前页码

			models.User.count({},function(error,count){//查询总数
				if (error) return console.log(error);

				var pageCount=Math.ceil(count/pageSize);//总页数
				currentPage=currentPage>pageCount? pageCount:currentPage;
				currentPage=currentPage<1? 1:currentPage;

				var skipNum=(currentPage-1)*pageSize;


				models.User.find({},function(error,users){
					if (error) return console.log(error);
					
					res.render('admin/user',{
						title:'用户管理',
						username:req.session.username||req.signedCookies.username,
						users:users,
						pageCount:Array(pageCount),//因为swig for in循环必须是数组或对象
						currentPage:currentPage,
						url:'/admin/user'
					});
				}).limit(pageSize).skip(skipNum).sort({through:1});
			})
			
		}else{
			res.redirect(303,'/?login=false');
		}
	},
	through:function(req,res){//审核通过
		var id=req.query.id;
		var url=req.headers['referer'];
		models.User.update({_id:id},{$set:{through:true}},function(error,callback){
			if (error) return console.error(error);
			res.redirect(303,url);
		});
	},
	delete:function(req,res){
		var id=req.query.id;
		var url=req.headers['referer'];
		models.User.remove({_id:id},function(error){
			if (error) return console.error(error);
			res.redirect(303,url);
		});
	},
	authorize:function(req,res){//授权并通过审核
		var userid=req.body.userid;
		var role=req.body.role;
		var url=req.headers['referer'];

		if (userid) {
			var query=models.User.where('_id').in(userid);
			models.User.update(query,{$set:{
				through:true,
				role:role
			}},{multi:true},function(error,callback){
				if (error) return console.error(error);
				res.redirect(303,url);
			});
		}else{
			res.redirect(303,url);
		}		
	},
}