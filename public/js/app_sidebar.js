$(function() {
	$.ajax({
		url:'/recentComments',
		type:'get',
		success:function(data){
			var comments=data.comments;
			var articles=data.articles;
			var html='';
			for(var i in comments){
				for(var j in articles){
					if (comments[i].articleId==articles[j]._id) {
					    html+="<li>"+comments[i].time+"  "+comments[i].name;
						html+="在<a href='/article/"+articles[j]._id+"'>《"+articles[j].title+"》中说:</a>";
						html+=comments[i].content+"</li>";
					};
				}
			}
			$('.recentComments').append(html);
		},
		error:function(error){
			console.log('近期评论发生错误');
		}
	});
});