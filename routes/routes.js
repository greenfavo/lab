var home=require("../controls/app/home.js");

module.exports=function(app){
	//主页
	app.get('/',home.home);
}