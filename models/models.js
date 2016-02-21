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
    /*
    角色:admin(系统管理员),拥有最高权限
    editor(编辑),发布文章,修改和删除自己的文章和回复评论
    member(成员),浏览和评论
    */
    role:{
        type:String,
        default:null
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
    comments:[
        {
            role:{//用户类型 user或visitor
                type:String,
                default:'visitor'
            },
            name: String,//游客名称或已登录用户名
            email:String,//只有游客需填写
            content: String,
            time: String,
            through:{
                type:Boolean,
                default:false
            },
        }
    ], 
    views:{//浏览量
        type:Number,
        default:0
    },
    files:
    [    
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
        role:'admin',
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