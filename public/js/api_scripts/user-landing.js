function load_user_jobs(){
	var numberofrecs = 9;
	var max_pagination_elements = 6;
	var post_data = {
		numberofrec:numberofrecs,
		offset:0,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('auditordetails',post_data,function(res){
			console.log(res)
			$("#job-list").html("")
			var template = _.template($('#job-template').html());
			var job_array = res[0]['data']
			var job_array_length = Object.keys(res[0]['data']).length
			for(i=0;i<job_array_length;i++){
				element = job_array[i]
				element['userid'] = element['userdetailID']
				element['completeddate'] = moment.utc(parseInt(job_array[i]['endDate'])).format("DD-MM-YYYY HH:mm A");
				$("#job-list").append(template(element));
			}
			var values = numberofrecs
			var pagination_limit = res[0]['totalrecs']/numberofrecs;
			var no_elements = parseInt(pagination_limit);
			if(pagination_limit.toString().indexOf(".")>0 && pagination_limit>1){
				no_elements +=1 ;
			}
			if(no_elements>1){
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
	var numberofrecs = 9;
	var offset = parseInt($(this).attr("data-index")) * numberofrecs;
	$(".pagination-element").removeClass("active")
	$(this).addClass("active")
	var post_data = {
		numberofrec:numberofrecs,
		offset:offset,
		jwt_token:localStorage['ooh-jwt-token']
	}
	var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
	kumulos_init.call('auditordetails',post_data,function(res){
		$("#job-list").html("")
		var template = _.template($('#job-template').html());
		var job_array = res[0]
		var job_array_length = Object.keys(res[0]).length
		for(i=0;i<job_array_length;i++){
			var element = job_array[i]
			element['userid'] = element['userdetailID']
			$("#job-list").append(template(element));
		}
	})
})
$("#search-job-by-name").click(function(){
	var numberofrecs = 10000;
	var max_pagination_elements = 6;
	var search_content = $("#search-area").val()
	var post_data = {
		nameorid:search_content,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		if(search_content.length){
			var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
			kumulos_init.call('auditorfilter',post_data,function(res){
				$("#job-list").html("")
				var template = _.template($('#job-template').html());
				var job_array = res[0]
				var job_array_length = Object.keys(res[0]).length
				for(i=0;i<job_array_length;i++){
					element = job_array[i]
					element['email'] = element['emailId']
					element['cmptd_jobs_count'] = element['count']
					element['completeddate'] = moment.utc(parseInt(job_array[i]['endDate'])).format("DD-MM-YYYY HH:mm A");
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
	load_user_jobs();
	$("#search-area").val("")
	$("#search-area").removeAttr("disabled")
	$(".pagination").removeClass("hide")

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
	load_user_jobs();
});


$("#job-list").on("click",".userData .u-right",function(e){
	var user_id = $(this).attr("data-user-id")
	window.location.href = "/user-details?id="+user_id

})

$(document).on("click",".remove-user",function(e){
	var that = this
	var post_data = {
		userid:$(this).closest(".userData").find(".u-right").attr("data-user-id"),
		jwt_token:localStorage['ooh-jwt-token']
	}
	if (confirm("Are you sure to remove this user?") == true) {
        txt = "You pressed OK!";
        var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
			kumulos_init.call('deleteauditor',post_data,function(res){
		if(res[0].status == "success")
        	$(that).closest(".col-md-4").remove();
		})
    } else {
        // txt = "You pressed Cancel!";
    }
	// return
})

