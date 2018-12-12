$(function() {
	 $.ajax({
		  url: "/menulist",
		  cache: false,
		  success: function(data){
			  			var menuList = JSON.parse(data);
			  			generateMenu(menuList,$('#cssmenu'));
		      		}  
          });
});

function generateMenu( menuList, parentContainer){
		var parentUL = $('<ul></ul>').appendTo(parentContainer);  
	
	   for( var i=0; i< menuList.length; i++)
	   {
		   var li =  $('<li></li>').appendTo(parentUL);
		   var anchor = $('<a></a>').attr('href',menuList[i].link?menuList[i].link:'#').text(menuList[i].title).appendTo(li);
		   if(menuList[i].link && (menuList[i].link.indexOf('http')!==-1))
			   anchor.attr('target','_blank');
		   
		   if (menuList[i].children && menuList[i].children.length > 0)
		   {
			   $('<span class="parentli"></span>').appendTo(li);
			   generateMenu(menuList[i].children,li);
		   }
		      		   
	   }
}