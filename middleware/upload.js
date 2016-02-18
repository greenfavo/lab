var formidable=require("formidable");
var fs=require("fs");
var path=require("path");
var util=require("util");

module.exports={
	deleTemp:function(filePath){
		fs.unlink(filePath, function(err) {
	        if (err) {
	            console.info("临时文件删除失败");
	            console.error(err);
	        } else {
	            console.info("删除成功");
	        }
	    });
	},
	upload:function(req,res,type){

		var form=new formidable.IncomingForm();

	    form.maxFieldsSize=10*1024*1024;//文件最大为10M

	    form.keepExtensions = true;//使用文件的原扩展名

	    //文件移动的目录文件夹，不存在时创建目标文件夹

	    var targetDir=path.join('./public/upload');

	    if (!fs.existsSync(targetDir))  fs.mkdir(targetDir);

	    //临时文件目录,不存在则创建
	    form.uploadDir=path.join('./public/upload/temp');

	    if (!fs.existsSync(form.uploadDir)) fs.mkdir(form.uploadDir);

	    form.parse(req, function (err, fields, file) {

	        if (err) {
	          console.log("发生错误:"+err);
	          this.deleTemp(filePath);//删除临时文件
	        }

	        var filePath="";
	        //从临时文件中遍历第一个上传的文件
	        if (file.filepath) {
	            filePath=file.filepath.path;
	        }else{
	            for(var key in file){
	                if (file[key].path&&filePath==='') {
	                    filePath=file[key].path;
	                    break;
	                };
	            }
	        }   

	        //截取文件扩展名,例如.jpg
	        var fileExt=filePath.substring(filePath.lastIndexOf('.'));
	        var typeString='';

	        if (type===img) {
	        	url='./public/upload/img';
	        	typeString='.jpg.jpeg.png.gif.bmp';
	        }else{
	        	url='./public/upload/file';
	        	typeString='.psd.docx.doc.xls.xlsx.pptx.ppt.pdf.zip.rar';
	        }
	        //判断文件类型是否允许上传
	        if ((typeString).indexOf(fileExt.toLowerCase())===-1) {
	            var err = new Error('此文件类型不允许上传');
	            res.json({code:-1, message:'此文件类型不允许上传'});
	            this.deleTemp(filePath);//删除临时文件
	        }else{
	            var d=new Date();
	            var fileName=d.getTime()+fileExt;
	            var targetFile=path.join(targetDir,fileName);

	            //移动文件
	            fs.rename(filePath,targetFile,function(err){
	                if (err) {
	                    console.log(err);
	                    res.json({code:-1, message:'操作失败'});
	                    this.deleTemp(filePath);//删除临时文件
	                }else{
	                    //上传成功,存入数据库
	                    res.redirect(303, '/article/new');
	                }
	            });         
	        }       
	    });
	}
}