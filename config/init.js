var config = require('./config');
// blog初始化配置
module.exports = function(app, mongoose){
    // 根据环境选择日志工具
    switch(app.get('env')){
        case 'development':
            app.use(require('morgan')('dev'));
            break;
        case 'production':
            app.use(require('express-logger')({
                path: __dirname + '/log/request.log'
            }));
            break;
    }

    // 根据环境连接不同数据库
    switch(app.get('env')){
        case 'development':
            mongoose.connect(config.mongo.development.connectionString, config.mongo.opts);
            break;
        case 'production':
            mongoose.connect(config.mongo.production.connectionString, config.mongo.opts);
            break;
        default:
            throw new Error(app.get('env') + '是不被连接数据库的执行环境');
    }
};