var models=require('../../models/models.js');
var ueditor=require('../../middleware/ueditor.js');
var format=require('../../middleware/format.js');


var fs=require('fs');
var path=require('path');

module.exports={
	publish:function(req,res){
		if (req.session.username||req.signedCookies.username) {
			//定义session.file为数组    
    		req.session.file=[];
    		models.Category.find({},function(error,docs){
    			if (error) {
    				res.send(error);
    			}else{
    				res.render('admin/publishArticle',{
						title:'新建文章',
						username:req.session.username||req.signedCookies.username,
						category:docs
					});
    			}
    		});			
		}else{
			res.redirect(303,'/?login=false');
		}
		
	},
	ueditor:ueditor(path.join(__dirname,'../../public'),function(req,res,next){
		//创建文件夹
	    var uploadDir=path.join(__dirname, '../../public/upload');
	    if (!fs.existsSync(uploadDir))  fs.mkdir(uploadDir);

	    var imagesDir=path.join(__dirname, '../../public/upload/img');
	    if (!fs.existsSync(imagesDir))  fs.mkdir(imagesDir);

	    var filesDir=path.join(__dirname, '../../public/upload/file');
	    if (!fs.existsSync(filesDir))  fs.mkdir(filesDir);

	    if (req.query.action==='uploadimage') {//上传单张图片
	 
	        var imgname=req.ueditor.filename;

	        var img_url="/upload/img/";

	        res.ue_up(img_url);//输入保存地址
	    
	    }else if(req.query.action==="listimage"){//上传多张图片及列出图片目录

	        var dir_url="/upload/img/";

	        res.ue_list(dir_url);//客户端会列出该目录下的所有图片
	    
	    }else if (req.query.action==='uploadfile') {//上传附件

	        var filename=req.ueditor.filename;//原文件名

	        var file_url="/upload/file/";

	        res.ue_up(file_url);//输入保存地址

	        //将文件名和路径存入session
	        var obj={

	                "fileName":filename,

	                "filepath":req.ueditor.url
	            }
	        req.session.file.push(obj);
	        //打印req.session.file属性
	        console.log(Object.getOwnPropertyDescriptor(req.session, 'file'));

	    }else if(req.query.action==="listfile"){//附件目录列表
	        var dir_url="/upload/file/";

	        res.ue_list(dir_url);//客户端会列出该目录下的所有文件
	    
	    }else{// 客户端发起其它请求
	       
	        res.setHeader("Content-type","application/json");

	        res.redirect('/ueditor/nodejs/config.json');

	    }

	}),
	save:function(req,res){
		var title=req.body.articleTitle;
		var category=req.body.category;
		var content=req.body.articleContent;
		var tag=req.body.tag;
		var time=format().now;

		var doc={
			title:title,
			content:content,
			time:time,
			classes:category,
			tag:tag,
			author:req.session.username||req.signedCookies.username,
			files:req.session.file
		};
		models.Article.create(doc,function(error,article){
			if (error){
				console.error(error);
			}else{
				console.log(doc);
				req.session.file=[];//置空session.file
				//获得返回的id
				res.redirect(303,'/admin/article/edit?id='+article._id);
			}
		})		
	},
	edit:function(req,res){
		if (req.session.username||req.signedCookies.username) {
			var id=req.query.id;
			models.Article.findById(id,function(error,doc){
				if (error) {
					console.error(error);
				}else{
					models.Category.find({},function(error,category){
						var checked=[];//找出当前已选分类
						for( var c in category){
							checked[c]='';
							for(var i in doc.classes){
								if (category[c].name==doc.classes[i]) {
									checked[c]='checked';
								}
							}
						}
						res.render('admin/editArticle',{
							title:'编辑文章',
							username:req.session.username||req.signedCookies.username,
							doc:doc,
							checked:checked,
							category:category,
						});
					})					
				}
			});
		}else{
			res.redirect(303,'/?login=false');
		}
	},
	update:function(req,res){
		var title=req.body.articleTitle;
		var category=req.body.category;
		var content=req.body.articleContent;
		var tag=req.body.tag;
		var time=format().now;

		var id=req.query.id;

		models.Article.update({'_id':id},{$set:{
			title:title,
			classes:category,
			content:content,
			tag:tag,
			time:time
		}},function(err,doc){
			if (err){
				console.log(err);

			}else{
				res.redirect(303,'/admin/article/edit?id='+id);
			}
			
		});
	},
	all:function(req,res){
		if (req.session.username||req.signedCookies.username) {
			var pageSize=10;//每页文档数
			var currentPage=req.query.page||1;//当前页码

    		models.Article.count({},function(error,count){
    			if (error) return console.error(error);

				var pageCount=Math.ceil(count/pageSize);//总页数
				currentPage=currentPage>pageCount? pageCount : currentPage;
				currentPage=currentPage<1? 1:currentPage;
				var skipNum=(currentPage-1)*pageSize;//跳过的文档数


				models.Article.find({},function(error,docs){//查询文章总数
					if (error) return console.log(error);
					res.render('admin/allArticle',{
						title:'所有文章',
						article:docs,
						username:req.session.username||req.signedCookies.username,
						pageCount:Array(pageCount),//因为swig for in循环必须是数组或对象
						currentPage:currentPage,
						url:'/admin/article',
					});					
				}).limit(pageSize).skip(skipNum).sort({_id:-1});//倒序排列
    		});
    		
		}else{
			res.redirect(303,'/?login=false');
		}
	},
	delete:function(req,res){
		var id=req.body.id;
		models.Article.find({_id:id},function(error,doc){
			if (error) {
				res.json({
					signal:'error'
				});
			}else if (!doc.length) {
				res.json({
					signal:'no'
				})
			}else{
				models.Article.remove({_id:id},function(error){
					if (error) {
						res.json({
							signal:'error'
						});
					}else{
						res.json({
							signal:'success'
						});
						models.Comment.remove({articleId:id},function(error){
							if (error) return console.error(error);
						});
					}
				});
			}
		});
	},
	deleteSelected:function(req,res){
		var post=req.body.postid;//id数组
		var query=models.Article.where('_id').in(post);//批量多个
		var query2=models.Comment.where('articleId').in(post);

		models.Article.remove(query,function(error,docs){
			if (error) {
				console.error(error);
			}else{
				models.Comment.remove(query2,function(error){//删除相关评论
					if (error) return console.error(error);
				});
				res.redirect(303,'/admin/article');
			}
		});
	}
	

}