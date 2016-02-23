$(document).ready(function() {
	
	$('.addTag').click(function(event) {
		var tag=$('#tag').val();
		if (tag) {
			$('.tags').append("<p><input type='text' name='tag' value='"+tag+"'/><span class='glyphicon glyphicon-remove removeTag'></span></p>");
		}
		$('#tag').val('');
	});
	
	$('.tags').on('click','.removeTag',function(){
		$(this).parent('p').remove();
	});

	//折叠菜单
	$(".articleBtn").click(function(event) {
		$('.articleMenu').slideToggle();
	});

	//所有文章截断标题
	$('.all_title').each(function(index, el) {
		var str=str_substr($(this).text(),15);
		$(this).text(str);
	});

	checkAll($('.checkAll'),$('.cate_box'));
	checkAll($('.checkAll'),$('.article_box'));
	checkAll($('.checkAll'),$('.user_box'));
	checkAll($('.checkComments'),$('.comment_box'));




	$('.addCategory').click(addCategory);
	$('.deleteBtn').click(deleteCategory(event));
	$('.delete_article_btn').click(deleteArticle);

	function checkAll(checkAll,checkBox){
		var checkAllBtn=$(checkAll);
		var checkBoxArray=$(checkBox);

		checkAllBtn.click(function(event) {
			for(var i=0;i<checkBoxArray.length;i++){
				if (checkBoxArray[i].checked===true) {
					checkBoxArray[i].checked=false;
				}else{
					checkBoxArray[i].checked=true;
				}
			}
		});
	}

	function addCategory(){
		var name=$('.categoryName').val();
		var alias=$('.alias').val();
		var parent=$('.parent').val();
		$.ajax({
			url:'/admin/article/category/add',
			type:'POST',
			data:{
				name:name,
				alias:alias,
				parent:parent
			},
			success:function(data){
				if (data.signal==='success') {
					alert('插入成功');
					$('.categoryName').val('');
					$('.alias').val('');
					$('.parent').append("<option value='"+data.id+"' class='"+data.id+"'>"+data.name+"</option>");
					
					var html="<tr class='"+data.id+"'><td>";
					html+="<input type=\"checkbox\" name='category' class=\"cate_box\" value='"+data.id+"'/>";
		    		html+="</td>";
		    		html+="<td>"+data.name+"</td>";
		    		html+="<td>"+data.alias+"</td>";
		    		html+="<td><a href='?delete="+data.id+"'>删除</a>  ";
		    		html+="<a href='/admin/article/category/edit?id="+data.id+"'>编辑</a></td>";
		    		html+="</tr>";
					$('.ctb').append(html);
				}else if (data.signal==='exist') {
					alert('该分类名称或别名已存在');
				};
			},
			error:function(){
				console.log('请求出错');
			}
		})
	}

	function deleteCategory(){
		event.preventDefault();
		var deleteId=getQueryString('delete');
		if (deleteId!=null) {
			$.post('/admin/article/category/delete', {id:deleteId},function(data) {
				if (data.signal==='success') {
					$('.'+deleteId).remove();
					alert('删除成功');
				}else if (data.signal==='no') {
					alert('该分类不存在');
				}else if(data.signal==='error'){
					alert('请求出错');
				}
			});
		};
	}
	function deleteArticle(){
		var deleteId=$(this).attr('href');
		if (deleteId!=null) {
			$.post('/admin/article/delete', {id:deleteId},function(data) {
				if (data.signal==='success') {
					$('.'+deleteId).remove();
					alert('删除成功');
				}else if (data.signal==='no') {
					alert('该文章不存在');
				}else if(data.signal==='error'){
					alert('请求出错');
				}
			});
		};
		return false;
	}
    function str_substr(str,n){
    	if (str.length>n) {
    		str=str.substr(0,n)+"...";
    	};
    	return str;
    } 
    function getQueryString(name) {  
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
        var r = window.location.search.substr(1).match(reg);  
        if (r != null) return unescape(r[2]);  
        return null;  
    }  

});