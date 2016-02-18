//时间日期格式化
module.exports=function(format){
	var format=format||'-';
	var d=new Date();

	var year=d.getFullYear();
	var month=d.getMonth()+1;
	var day=d.getDate();
	var hours=d.getHours();
	var minutes=d.getMinutes();
	var seconds=d.getSeconds();

	return {
		now:year+format+month+format+day+" "+hours+":"+minutes+":"+seconds
	}
}