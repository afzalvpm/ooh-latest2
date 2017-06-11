function load_inspection(){
	var numberofrecs = 9;
	var max_pagination_elements = 5;
	var post_data = {
		type:"completed",
		numberofrec:numberofrecs,
		offset:0,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('viewallinspections',post_data,function(res){
			$("#job-list").html("")
			var job_array = res[0]['data']
			var job_array_length = Object.keys(res[0]['data']).length
			var template = _.template($('#job-template').html());
			for(i=0;i<job_array_length;i++){
				var element = job_array[i]
				var date = new Date(parseInt(element.completedDate));
				element['completeddate'] = moment.utc(parseInt(job_array[i]['endDate'])*1000).format("DD-MM-YYYY HH:mm A");
				element['start_date'] =  moment.utc(parseInt(job_array[i]['dateofInspection'])*1000).format("DD-MM-YYYY HH:mm A");
				$("#job-list").append(template(element));
			}
			var pagination_limit = res[0]['totalcount']/numberofrecs;
			var no_elements = parseInt(pagination_limit);
			if(pagination_limit.toString().indexOf(".")>0 && pagination_limit>0){
				no_elements +=1 ;
			}
			if(no_elements>1 && job_array.length){
				var element_array = [];
				var template = _.template($('#pagination-template').html());
				for(i=0;i<no_elements;i++){
					var is_hidden = max_pagination_elements > i ? false : true;
					element_array.push({label:i+1,index:i,is_hidden:is_hidden});
				}
				$(".pagination").html(template({items:element_array}));


			}
		})
	}
}
$(document).on("click",".pagination-element",function(){
	var numberofrec = 9;
	$(".pagination-element").removeClass("active")
	$(this).addClass("active")
	var offset = parseInt($(this).attr("data-index"))* numberofrec
	var post_data = {
		type:"completed",
		numberofrec:numberofrec,
		offset:offset,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		var template = _.template($('#job-template').html());
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('viewallinspections',post_data,function(res){
			var job_array = res[0]['data']
			var job_array_length = Object.keys(res[0]['data']).length
			if(job_array_length){
				$("#job-list").html("")				
				var template = _.template($('#job-template').html());
				for(i=0;i<job_array.length;i++){
					var element = job_array[i]
					var date = new Date(parseInt(element.completedDate));
					element['completeddate'] = moment.utc(parseInt(job_array[i]['endDate'])*1000).format("DD-MM-YYYY HH:mm A");
					element['start_date'] =  moment.utc(parseInt(job_array[i]['dateofInspection'])*1000).format("DD-MM-YYYY HH:mm A");
					$("#job-list").append(template(element));

				}
			}
		})
	}
})
$(document).on("click",".pagination .last-element",function(e){
	e.preventDefault();
	$('.pagination > .pagination-element').addClass("hide");
	$('.pagination > .pagination-element').slice(-5).removeClass("hide");
	$('.pagination > .pagination-element').not("hide").last().click()

})
$(document).on("click",".pagination .first-element",function(e){
	e.preventDefault();
	$('.pagination > .pagination-element').addClass("hide");
	$('.pagination > .pagination-element').slice(0,5).removeClass("hide");
	$('.pagination > .pagination-element').not("hide").first().click()
})
$(document).on("click",".pagination .previous-element",function(e){
	e.preventDefault();
	var current_element = $(".pagination-element.active")
	if(current_element.prev().hasClass("pagination-element")){
		$(".pagination-element").not("hide").last("hide");
		if($(".pagination > .pagination-element").not(".hide").length>5)
			$(".pagination > .pagination-element").not(".hide").last().addClass("hide")
		current_element.prev().removeClass("hide").addClass("active").click()
	}
})
$(document).on("click",".pagination .next-element",function(e){
	e.preventDefault();
	var current_element = $(".pagination-element.active")
	if(current_element.next().hasClass("pagination-element")){
		$(".pagination-element").not("hide").first("hide");
		if($(".pagination > .pagination-element").not(".hide").length>5)
			$(".pagination > .pagination-element").not(".hide").first().addClass("hide")
		current_element.next().removeClass("hide").addClass("active").click()
	}
})


$(function(){ 
	load_inspection();
});

$("#search-job-by-name").click(function(){
	var numberofrecs = 9;
	var max_pagination_elements = 6;
	var search_content = $("#search-area").val()
	var post_data = {
		type:"completed",
		param:search_content,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		if(search_content.length){
			var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
			kumulos_init.call('inspectionfilter',post_data,function(res){
				$("#job-list").html("")
				var template = _.template($('#job-template').html());
				var job_array = res[0]
				var job_array_length = Object.keys(res[0]).length
				for(i=0;i<job_array_length;i++){
					element = job_array[i]
					element['start_date'] =  moment.utc(parseInt(job_array[i]['dateofInspection'])*1000).format("DD-MM-YYYY HH:mm A");
					$("#job-list").append(template(element));
				}
				$(".pagination").addClass("hide")
				$("#search-area").attr("disabled","disabled")
							// $("#clear-search").removeClass("hide");
						})
		}
	}
})

$("#clear-search").on("click",function(){
	load_inspection()
	$("#search-area").val("")
	$("#search-area").removeAttr("disabled")
	$(".pagination").removeClass("hide")

})