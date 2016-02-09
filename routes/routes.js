var home=require("../controls/app/home.js");
var login=require("../controls/app/login.js");
var register=require('../controls/app/register.js');


module.exports=function(app){
	//主页
	app.get('/',home.home);

	//登录验证
	app.post('/login',login.login);
	//已登录处理
	app.get('/login/username',login.logined);
	//登出
	app.get('/login/out',login.loginOut);

	//注册
	app.post('/register',register.handleReg);

}