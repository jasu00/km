var grid = $("<div id='grid'><img src='/images/preloader.gif'/></div>");

function getCollection(collection)
{
	$('#dataGrid').empty();
	$('#dataGrid').removeClass();
	$('#dataGrid').append(grid);
    $.ajax({
		  url: "/collection/"+collection,
		  cache: false,
		  success: function(data){
            var dataCols = [];
            var keys=[];
            var results = JSON.parse(data);
            results.forEach( function(result){
            				for(var key in result){
				            	if(key!="_id")
				                {
					                if(!keys.includes(key)){
				                	keys.push(key)
					                dataCols.push({"header":key,"key":key});
				                	}
				                }
				            }
            				});
            $('#grid').columns({size:25,schema :dataCols,data: results});
		  }  			  
		});
}
function getRest(type)
{
	$('#dataGrid').empty();
	$('#dataGrid').removeClass();
	$('#dataGrid').append(grid);
    $.ajax({
		  url: "/"+type,
		  cache: false,
		  success: function(data){
            var dataCols = [];
            var keys=[];
            var results = JSON.parse(data);
            results.forEach( function(result){
            				for(var key in result){
				            	if(key!="_id")
				                {
					                if(!keys.includes(key)){
				                	keys.push(key)
					                dataCols.push({"header":key,"key":key});
				                	}
				                }
				            }
            				});
            $('#grid').columns({size:25,schema :dataCols,data: results});
		  }  			  
		});
}

function showCalendar(team)
{
	$('#dataGrid').empty();
	$('#dataGrid').removeClass();
	$('#dataGrid').fullCalendar('destroy');
    $('#dataGrid').append(grid);
    $('#dataGrid').fullCalendar({
    	firstDay : 1,
    	aspectRatio : 2.5,
		header: {
	        left: 'prev,next today',
	        center: 'title',
	        right: 'month,basicWeek,basicDay'
	      },
	    navLinks: true, // can click day/week names to navigate views
	    editable: false,
	    eventLimit: true, // allow "more" link when too many events
	    eventSources: [
	        {url: '/calendar/'+team},
	      ],
	      eventRender: function(event, element) {
	    	  element.attr('href', 'javascript:void(0);');
	          element.click(function() {
	              alert(event.description?(event.title+':'+event.description):event.title);
	          });
	    	  }
	});
	
	grid.remove();
}


