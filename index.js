var express = require('express');
var app = express();

var bodyParser=require('body-parser');
var mongoose=require('mongoose');

//加载Node模块
var config = require('./config/config.js'); //参数设置文件
var domain = require('./middleware/error.js'); //域处理异常
var thread = require('./middleware/cluster.js'); //多线程显示
var test = require('./middleware/test.js'); //单元测试
//var admin_routes = require('./routes/admin_routes.js'); //加载管理员页面路由
var routes = require('./routes/routes.js');

//var sessionStore = new MongoSessionStore({url: config.mongo[app.get('env')].connectionString});

// 初始化配置
require('./config/init.js')(app, mongoose);


// 设置模版引擎
app.engine('html', config.template.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
// 设置端口号
app.set('port', config.PORT);
// 加载域处理未捕获异常中间件
app.use(domain);
// 加载多线程显示中间件
app.use(thread);
// 加载单元测试中间件
app.use(test);

// 加载中间件

// 加载设置静态文件目录的中间件
app.use(express.static(__dirname + '/public'));


//使用body-parser中间件
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());

// 加载cookie-parser来设置和访问cookie
app.use(require('cookie-parser')(config.cookieSecret));
// 加载会话
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: config.cookieSecret,
}));

// 路由

routes(app);
//admin_routes(app);


// 处理异常
// 定制404页面
app.use(function(req, res){
    res.status(404);
    res.render('404',{title:404});
});

// 定制500页面
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500',{title:500});
});

// 服务器集群
var startServer = function(){
    app.listen(app.get('port'), function(){
        console.log('Express started in ' + app.get('env') + ' node on http://localhost:' + app.get('port') + '; Press Ctrl + C to exit.');
    });
};
if (require.main === module) {
    // 应用程序直接运行；启动应用服务器
    startServer();
}
else{
    // 应用程序作为一个模块被导入
    module.exports = startServer;
}