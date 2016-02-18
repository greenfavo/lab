var mongoose = require('mongoose');
// 模型的构建

// 创建模式
// 用户模式
var userSchema = mongoose.Schema({
    trueName: String,
    userName: String,
    password: String,
    email: String,
    group: String, //用户所属的组
    phone: String,
    control: {
        sign: String, //一串能够指明用户有哪些权限的数据
        userClass: String //用户类型，如果是管理员则为admin
    },
    through:{
        type:Boolean,
        default:false
    }
});
// 文章模式
var articleSchema = mongoose.Schema({
    title: String,
    author: String,
    content: String,
    time: String,
    classes:[String], //文章所属分组
    tag: [String], //标签
    comments: {
        users: [{
            userName: String,
            content: String,
            time: String
        }], //用户留言
        visitor: [{
            userEmail: String,
            content: String,
            time: String
        }] //游客留言
    },
    views:{
        type:Number,
        default:0
    },
    files:
    [    // 格式为"fileName: url"
        {
            fileName:String,
            filepath:String
        }
    ]
});
//分类目录模式
var categorySchema=mongoose.Schema({
    name:String,//名称
    alias:String,//别名
    pid:{//父节点id
        type:String,
        default:null
    }
});

// 绑定模型
// 用户模型
var User = mongoose.model('User', userSchema);
var Article = mongoose.model('Article', articleSchema);
var Category =mongoose.model('Category',categorySchema);

// 初始化，添加最高权限用户root
User.find(function(err, users){
    if(users.length)
        return;
    new User({
        trueName: '帖军',
        userName: 'root',
        password: 'root',
        email: '',
        group: 'FeWeb',
        phone: '',
        control: {
            sign: '',
            userClass: 'root'
        },
        through: true
    }).save(function(err, docs){
        if(err) return console.log(err);
        console.dir(docs);
    });
});
// 导出模型
exports.User = User;
exports.Article = Article;
exports.Category=Category;