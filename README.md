# 用nodejs+mongodb+swig+express写的实验室内部项目-内容管理系统 

##1，项目描述
基于nodejs后端语言，express web应用开发框架，swig模板引擎和mongodb数据库开发的实验室官网。这本来是实验室暑假的内部项目，我只参与了文件上传部分的开发，对整个流程不是很了解，未上线。于是现在又自己从头到尾重新做一遍。[原网站][1]是用wordpress做的，于是我就模仿wordpress的功能写。
##2，项目完成程度
###完成的后台功能:
* 首页:待审核用户，待审核评论
* 文章管理：新建，编辑，查看，删除，显示所有文章，批量删除，分页
* 分类目录：新建，编辑，查看，删除，显示所有分类，批量删除
* 用户管理:查看所有用户，授权，删除
* 评论管理:查看所有评论，批准，删除

###完成的前端显示
 1. 登录/注册
 2. 首页显示所有文章，分页
 3. 热门文章:根据文章页面浏览量排序
 4. 近期评论：按时间排序
 5. 已登录用户或游客评论
 
##3，运行
* 安装依赖项:在项目根目录下运行
```
$ npm install
```
* 打开mongodb服务器
*  启动项目
```
$ node index
```
打开浏览器输入url: localhost:3000打开首页
*  js/css压缩合并
```
$ gulp
```
##4,效果展示
1,首页
![首页](/public/img/show_home.png)
2,前台评论
![前台评论](/public/img/show_comment.png)
3,后台首页
![仪表盘](/public/img/show_admin.png)
4,所有文章
![所有文章](/public/img/show_admin_allpost.png)
5,编辑文章
![编辑文章](/public/img/show_admin_edit.png)
6,分类目录
![分类目录](/public/img/show_admin_category.png)
7,用户管理
![用户管理](/public/img/show_admin_user.png)
8,评论管理
![评论管理](/public/img/show_admin_comment.png)
##5,备注
前端查询功能尚未全部完成。后台列出来的功能全部完成。
后台地址:localhost:3000/admin
后台初始账号密码:root,root

  [1]: http://www.new-thread.com/
  
