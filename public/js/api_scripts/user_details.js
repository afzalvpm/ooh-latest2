var user_id =window.location.href.split("id=")[1]
function load_user_jobs(type,offset){
	var numberofrecs = 9;
	var max_pagination_elements = 5;
	var post_data = {
		status:type,
		numberofrec:numberofrecs,
		offset:offset,
		userid:user_id,
		jwt_token:localStorage['ooh-jwt-token']
	}
	console.log(post_data)
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('viewalljobsdetails',post_data,function(res){
				$("table.table[data-type='"+type+"'] .job-list").html("")
				var job_array = res[0]['data'];
				var job_array_length = Object.keys(res[0]['data']).length
				var template = _.template($('.job-template[data-type="'+type+'"]').html());
				for(i=0;i<job_array.length;i++){
					var element = job_array[i]
					var date = new Date(parseInt(element.completedDate));
					element['completeddate'] = moment.utc(parseInt(job_array[i]['completedDate'])*1000).format("DD-MM-YYYY HH:mm A");
					if(type == "WIP")
						element['completeddate'] = moment.utc(parseInt(job_array[i]['endDate'])*1000).format("DD-MM-YYYY HH:mm A");
					$("table.table[data-type='"+type+"'] .job-list").append(template(element));
				}
				var pagination_limit = res[0]['totalcount']/numberofrecs;
				var no_elements = parseInt(pagination_limit);
				if(pagination_limit.toString().indexOf(".")>0 && pagination_limit>0){
					no_elements +=1 ;
				}
				if(no_elements>1){
					var element_array = [];
					var template = _.template($('#pagination-template').html());
					for(i=0;i<no_elements;i++){
						var is_hidden = max_pagination_elements > i ? false : true;
						element_array.push({label:i+1,index:i,is_hidden:is_hidden});
					}
					$(".pagination[data-type='"+type+"']").html(template({items:element_array}));


				}
			})
	}
}

$(function(){
	load_user_jobs("WIP",0)
	load_user_jobs("completed",0)
	load_user_jobs("canceled",0)
	var post_data = {
		userid:window.location.href.split("id=")[1],
		jwt_token:localStorage['ooh-jwt-token']
	}
	var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
	kumulos_init.call('getauditordetails',post_data,function(res){
		$("#search-name").val(res[0].name).attr("disabled","disabled");
		$("#search-email").val(res[0].email).attr("disabled","disabled");

	})
	$("#OISID").text(window.location.href.split("id=")[1])
	





})

$("#search-job-button").on("click",function(e){
	e.preventDefault();
	var user_name = $("#search-name").val()
	var user_email = $("#search-email").val()
	if(user_name.length && user_email.length){
		load_user_jobs("WIP",user_id)
		load_user_jobs("completed",user_id)
		load_user_jobs("canceled",user_id)
		// load_user_jobs("aru.raval@gmail.com","Arundhati","WIP",0)
	}
})



$(document).on("click",".pagination-element",function(e){
	e.preventDefault()
	var numberofrecs = 9;
	var max_pagination_elements = 5;
	var offset = parseInt($(this).attr("data-index"))*numberofrecs;
	$(this).closest(".booking-details").find(".pagination-element").removeClass("active")
	$(this).addClass("active")
	var section_type = $(this).closest(".booking-details").find(".table").attr("data-type")
	var post_data = {
		status:section_type,
		numberofrec:numberofrecs,
		offset:offset,
		username:"ALL",
		email:"ALL",
		userid:user_id,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('viewalljobsdetails',post_data,function(res){
			var job_array = res[0]['data']
			var job_array_length = Object.keys(res[0]['data']).length
			if(job_array_length){
				$(".job-list[data-type='"+section_type+"']").html("")
				var template = _.template($('.job-template[data-type="'+section_type+'"]').html());
				for(i=0;i<job_array_length;i++){
					var element = job_array[i]
					element['completeddate'] = moment.utc(parseInt(job_array[i]['completedDate'])*1000).format("DD-MM-YYYY HH:mm A");
					if(section_type =="WIP"){
						element['endDate'] = moment.utc(parseInt(job_array[i]['completedDate'])*1000).format("DD-MM-YYYY HH:mm A");
					}
					$(".job-list[data-type='"+section_type+"']").append(template(element));
					console.log(element)


				}
			}
		})
	}
})
$(document).on("click",".pagination .last-element",function(e){
	e.preventDefault();
	$(this).closest(".booking-details").find('.pagination > .pagination-element').addClass("hide");
	$(this).closest(".booking-details").find('.pagination > .pagination-element').slice(-5).removeClass("hide");
	$(this).closest(".booking-details").find('.pagination > .pagination-element').not("hide").last().click()
})
$(document).on("click",".pagination .first-element",function(e){
	e.preventDefault();
	$(this).closest(".booking-details").find('.pagination > .pagination-element').addClass("hide");
	$(this).closest(".booking-details").find('.pagination > .pagination-element').slice(0,5).removeClass("hide");
	$(this).closest(".booking-details").find('.pagination > .pagination-element').not("hide").first().click()
})
$(document).on("click",".pagination .previous-element",function(e){
	e.preventDefault();
	var current_element = $(this).closest(".booking-details").find(".pagination-element.active")
	if(current_element.prev().hasClass("pagination-element")){
		$(this).closest(".booking-details").find(".pagination-element").not("hide").last("hide");
		current_element.prev().removeClass("hide").addClass("active").click()
	}
})
$(document).on("click",".pagination .next-element",function(e){
	e.preventDefault();
	var current_element = $(this).closest(".booking-details").find(".pagination-element.active")
	if(current_element.next().hasClass("pagination-element")){
		$(this).closest(".booking-details").find(".pagination-element").not("hide").first("hide");
		current_element.next().removeClass("hide").addClass("active").click()
	}
})


$(".search-job-by-name").click(function(){
	var numberofrecs = 9;
	var max_pagination_elements = 6;
	var search_content = $(this).closest(".dd-data").find(".search-area").val()
	var post_data = {
		status:"completed",
		param:search_content,
		jwt_token:localStorage['ooh-jwt-token'],
		userid:window.location.href.split("id=")[1]
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		if(search_content.length){
			var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
			kumulos_init.call('userjoblistfilter',post_data,function(res){
				$(".job-list[data-type='completed']").html("")
				var template = _.template($('.job-template[data-type="completed"]').html());
				var job_array = res
				var job_array_length = res.length
				for(i=0;i< res.length;i++){
					element = job_array[i]
					element['completeddate'] = moment.utc(parseInt(job_array[i]['completedDate'])*1000).format("DD-MM-YYYY HH:mm A");
					$(".job-list[data-type='completed']").append(template(element));
				}
				$(".pagination[data-type='completed']").addClass("hide")
				$(".search-area").attr("disabled","disabled")
				$(".clear-search").removeClass("hide");
			})
		}
	}
})
$(".clear-search").on("click",function(){
	load_user_jobs("completed",0);
	$(".search-area").val("")
	$(".search-area").removeAttr("disabled")
	$(".pagination[data-type='completed']").removeClass("hide")

})


// view-data
// userjoblistfilter