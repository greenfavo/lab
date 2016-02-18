var models=require('../../models/models.js');
module.exports={
	category:function(req,res){
		if (req.session.username||req.signedCookies.username) {

			models.Category.find({},function(error,result){
				if (error) {
					console.log(error);
				}else{
					console.log(result);
					res.render('admin/category',{
						title:'分类目录',
						username:req.session.username||req.signedCookies.username,
						category:result
					});
				};
			})
			
		}else{
			res.redirect(303,'/?login=false');

		}
	},
	add:function(req,res){
		var name=req.body.name;
		var alias=req.body.alias;
		var parent=req.body.parent;

		var doc={
			name:name,
			alias:alias,
			pid:parent
		};

		console.log(doc);
		models.Category.find({
			$or:[
				{name:name},{alias:alias}
			]
		},function(error,result){
			if (error) console.log(error);
			if (result.length) {
				res.json({
					signal:'exist'
				});
			}else{
				models.Category.create(doc,function(error,result){
					if (error) {
						res.json({
							signal:'数据库错误',
						});
					}else{
						res.json({
							signal:'success',
							id:result._id,
							name:name,
							alias:alias
					});
						console.log('插入成功'+doc);
					}
				})
			}
		})

	},
	delete:function(req,res){
		var id=req.body.id;
		models.Category.find({_id:id},function(error,result){
			if (error) {
				res.json({
					signal:'error'
				});
			}else if (!result.length) {
				res.json({
					signal:'no'//不存在
				});
			}else{
				models.Category.remove({_id:id},function(error,docs){
					if (error) {
						res.json({
							signal:'error'
						});
					}else{
						console.log(docs);
						models.Category.update({pid:id},//将子节点的pid批量设为null
							{$set:{pid:null}},
							{multi:true},function(error){
								if (error) {
									res.json({
										signal:'error'
									});
								}else{
									res.json({
										signal:'success'
									})
								}
							}
						);
						
					}
				});

			};
		});
	},
	deleteSelected:function(req,res){//删除所选
		var category=req.body.category;//id数组
		var query=models.Category.where('_id').in(category);//批量多个
		models.Category.remove(query,function(error,docs){
			if (error) {
				console.error(error);
			}else{
				res.redirect(303,'/admin/article/category');
			}
		});
		for(var i in category){
			var id=category[i];
			models.Category.update({pid:id},//将子节点的pid批量设为null
				{$set:{pid:null}},
				{multi:true},function(error){
					if (error) {
						console.error(error);									
					}
				}
			);
		}
	},
	edit:function(req,res){
		var id=req.query.id;

		models.Category.findOne({_id:id},function(error,doc){
			if (error) {
				console.error(error);
			}else if(!doc){
				res.send('该分类不存在');
			}else{
				console.log(doc);
				//查找所有分类
				models.Category.find({},function(error,result){
					if (error) {
						console.log(error);
					}else{
						res.render('admin/editCategory',{
							title:'编辑分类',
							username:req.session.username||req.signedCookies.username,
							name:doc.name,
							alias:doc.alias,
							category:result
						})
					}
				})
			}
		});
	},
	handleEdit:function(req,res){
		var id=req.query.id;
		var name=req.body.name;
		var alias=req.body.alias;
		var pid=req.body.parent;

		models.Category.update({_id:id},
			{
				$set:{
					name:name,
					alias:alias,
					pid:pid
				}
			},function(error){
				if (error) {
					res.send(error);
				}else{
					res.redirect(303,'/admin/article/category');
				}
			})

	}
	
}
