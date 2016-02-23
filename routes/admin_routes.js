var home=require('../controls/admin/home.js');
var article=require('../controls/admin/article.js');
var category=require('../controls/admin/category.js');
var user=require('../controls/admin/user.js');
var comment=require('../controls/admin/comment.js');



module.exports=function(app){
	app.get('/admin',home.home);
    app.get('/admin/article',article.all);//所有文章
    app.post('/admin/article/delete',article.delete);//删除单个文章
    app.post('/admin/article/deleteSelected',article.deleteSelected);//删除所选文章

    //发布文章
    app.get('/admin/article/publish',article.publish);
    app.use('/admin/article/ue',article.ueditor);
    app.post('/admin/article/publish',article.save);

    //修改更新文章
    app.get('/admin/article/edit*',article.edit);
    app.post('/admin/article/edit*',article.update);

    //分类目录
    app.get('/admin/article/category',category.category);
    app.post('/admin/article/category/add',category.add);
    app.post('/admin/article/category/delete',category.delete);
    app.post('/admin/article/category',category.deleteSelected);
    
    app.get('/admin/article/category/edit',category.edit);
    app.post('/admin/article/category/edit',category.handleEdit);

    //用户管理
    app.get('/admin/user',user.user);//所有用户
    app.get('/admin/user/through*',user.through);//审核通过
    app.get('/admin/user/delete*',user.delete);//删除
    app.post('/admin/user/authorize',user.authorize);//授权并通过

    //评论管理
    app.get('/admin/comment',comment.comment);
    app.get('/admin/comment/through*',comment.through);//审核通过
    app.get('/admin/comment/delete',comment.delete);//删除
    app.post('/admin/comment/deleteSelected',comment.deleteSelected);//批量删除

}