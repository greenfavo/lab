var home=require('../controls/admin/home.js');
var article=require('../controls/admin/article.js');
var category=require('../controls/admin/category.js');

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

}