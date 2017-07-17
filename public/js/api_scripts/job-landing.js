function load_auditor(){
	var numberofrecs = $("#auditor-pagination-limit").val();
	var max_pagination_elements = 6;
	var post_data = {
		offset:0,
		numberofrec:numberofrecs,
		jwt_token:localStorage['ooh-jwt-token']
	}
	var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
	kumulos_init.call('auditordetails',post_data,function(res){
		console.log(res)
		$("#auditor-list").html("")
		var template = _.template($('#auditor-template').html());
		var job_array = res[0]['data']
		var job_array_length = Object.keys(res[0]['data']).length
		for(i=0;i<job_array_length;i++){
			element = job_array[i]
			$("#auditor-list").append(template(element));
		}
		var values = numberofrecs
		var pagination_limit = res[0]['totalrecs']/numberofrecs;
		var no_elements = parseInt(pagination_limit);
		console.log(no_elements)
		if(pagination_limit.toString().indexOf(".")>0 && pagination_limit>1){
			no_elements +=1 ;
		}
		if(no_elements>1 && job_array_length){
				$('.auditor-pagination-section .pagination').find("input").attr("data-max-page",no_elements)
			$('.auditor-pagination-section .pagination').jqPagination({
				paged: function(page) {
					update_auditors(page-1);
				}
			});

			}else{
				$(".auditor-pagination-section").addClass("hide");
		}
	})
}
function load_user_jobs(){
	var numberofrecs = $("#pagination-limit").val();
	var post_data = {
		numberofrec:numberofrecs,
		offset:0,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('viewactivejobs',post_data,function(res){
			$("#job-list").html("")
			var template = _.template($('#job-template').html());
			var job_array = res[0]['data']
			var job_array_length = Object.keys(res[0]['data']).length
			for(i=0;i<job_array_length;i++){
				element = job_array[i]
				element['state'] = element['statePostalCode'].split(" ")[0]
				element['PostalCode'] = element['statePostalCode'].split(" ")[1]
				element['startdate'] = moment.utc(parseInt(job_array[i]['startDate'])*1000).format("DD-MM-YYYY HH:mm A");
				element['completeddate'] = moment.utc(parseInt(job_array[i]['endDate'])*1000).format("DD-MM-YYYY HH:mm A");
				$("#job-list").append(template(element));
			}
			var values = numberofrecs
			var pagination_limit = res[0]['totalcount']/numberofrecs;
			var no_elements = parseInt(pagination_limit);
			console.log(no_elements)
			if(pagination_limit.toString().indexOf(".")>0 && pagination_limit>1){
				no_elements +=1 ;
			}
			if(no_elements>1 && job_array_length){
				$('.pagination-section .pagination').find("input").attr("data-max-page",no_elements)
			$('.pagination-section .pagination').jqPagination({
				paged: function(page) {
					update_jobs(page-1);
				}
			});

			}else{
				$(".pagination-section").addClass("hide");
			}
		})
	}

}

function update_auditors(page){
	var numberofrecs = $("#auditor-pagination-limit").val();
	var offset = parseInt(page)* numberofrecs
	var post_data = {
		numberofrec:numberofrecs,
		offset:offset,
		jwt_token:localStorage['ooh-jwt-token']
	}
	var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
	kumulos_init.call('auditordetails',post_data,function(res){
		$("#auditor-list").html("")
		var template = _.template($('#auditor-template').html());
		var job_array = res[0]['data']
		var job_array_length = Object.keys(res[0]['data']).length
		for(i=0;i<job_array_length;i++){
			element = job_array[i]
			$("#auditor-list").append(template(element));
		}
	})
}


function update_jobs(page){
	var numberofrecs = 1;
	var offset = parseInt(page)* numberofrecs
	var max_pagination_elements = 6;
	var post_data = {
		numberofrec:numberofrecs,
		offset:offset,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('viewactivejobs',post_data,function(res){
			$("#job-list").html("")
			var template = _.template($('#job-template').html());
			var job_array = res[0]['data']
			var job_array_length = Object.keys(res[0]['data']).length
			for(i=0;i<job_array_length;i++){
				element = job_array[i]
				element['state'] = element['statePostalCode'].split(" ")[0]
				element['PostalCode'] = element['statePostalCode'].split(" ")[1]
				element['startdate'] = moment.utc(parseInt(job_array[i]['startDate'])*1000).format("DD-MM-YYYY HH:mm A");
				element['completeddate'] = moment.utc(parseInt(job_array[i]['endDate'])*1000).format("DD-MM-YYYY HH:mm A");
				$("#job-list").append(template(element));
			}
		})
	}

}
$("#clear-search").on("click",function(){
	load_user_jobs();
	$("#search-area").val("")
	$("#search-area").removeAttr("disabled")
	$(".pagination[data-type='job']").removeClass("hide")
	$("#clear-search").addClass("hide");
	$("#search-view-active-job").removeClass("hide");

})

$(function(){ 
	load_user_jobs();
	load_auditor();
});


$("#select-all-jobs").on("change",function(e){
	if($(this).is(':checked')){
		$("#job-list").find(".checkbox input").prop("checked",true)
		$(".download-data.assign-btn").removeClass("hide")
	}else{
		$("#job-list").find(".checkbox input").prop("checked",false)
		$(".download-data.assign-btn").addClass("hide")
	}
})
$("#job-list").on("change",".checkbox input",function(){
	$("#select-all-jobs").prop("checked",false)
	if($("#job-list .checkbox input").is(":checked")){
		$(".download-data.assign-btn").removeClass("hide")
	}else{
		$(".download-data.assign-btn").addClass("hide")
	}
})

$(".download-data.assign-btn").on("click",function(){
	$("#assignModal").modal();
})

$(document).on("click",".auditor-element .userData",function(){
	$(".auditor-element .userData").removeClass("active")
	$(this).addClass("active");
	var selected_auditor = $(this).closest(".auditor-element").attr("data-id")
	$(".auditor-element .userData").removeClass("active")
	var is_selected_all_jobs = $("#select-all-jobs").is(":checked");
	var job_list = []
	var search_disabled = typeof($("#search-area").attr("disabled")) == "string"
	if (search_disabled) 
		is_selected_all_jobs = false;
	if(is_selected_all_jobs == false){
		var selected_jobs = $(".job-element")
		for(i=0;i<selected_jobs.length;i++){
			if($(selected_jobs[i]).find("input").is(":checked")){
				job_list.push($(selected_jobs[i]).attr("data-id"))
			}
		}
	}
	var post_data = {
		is_selected_all_jobs:is_selected_all_jobs,
		job_list :job_list,
		auditor_id:selected_auditor,
		jwt_token:localStorage['ooh-jwt-token']

	}
	console.log(post_data)
	var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
	kumulos_init.call('assignjobstoauditor',{data:post_data,jwt_token:localStorage['ooh-jwt-token']},function(res){
		$("#assignModal").modal("toggle")
		load_user_jobs()
		$(".download-data.assign-btn").addClass("hide")
		$("#select-all-jobs").prop("checked",false)
		$("#search-area").removeAttr('disabled');
	})
})

// $(document).on("click","#",function(){

// })

$("#search-view-active-job").click(function(){
	var numberofrecs = 9;
	var max_pagination_elements = 6;
	var search_content = $("#search-area").val()
	var post_data = {
		param:search_content,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		if(search_content.length){
			var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
			kumulos_init.call('viewactivejobfilter',post_data,function(res){
				$("#job-list").html("")
				$("#clear-search").removeClass("hide");
				$("#search-view-active-job").addClass("hide");
				$(".pagination").addClass("hide")
				$("#search-area").attr("disabled","disabled")
				if(res.length == 0){
					return
				}
				var template = _.template($('#job-template').html());
				var job_array = res
				var job_array_length = res.length
				for(i=0;i<job_array_length;i++){
					element = job_array[i]
					element['state'] = element['statePostalCode'].split(" ")[0]
					element['PostalCode'] = element['statePostalCode'].split(" ")[1]
					element['startdate'] = moment.utc(parseInt(job_array[i]['startDate'])*1000).format("DD-MM-YYYY HH:mm A");
					element['completeddate'] = moment.utc(parseInt(job_array[i]['endDate'])*1000).format("DD-MM-YYYY HH:mm A");
					$("#job-list").append(template(element));
				}
				
			})
		}
	}
})
$("#search-auditor").click(function(){
	var numberofrecs = 9;
	var max_pagination_elements = 6;
	var search_content = $("#auditor-name-input").val()
	var post_data = {
		nameorid:search_content,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		if(search_content.length){
			var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
			kumulos_init.call('auditorfilter',post_data,function(res){
				$("#auditor-list").html("")
				var template = _.template($('#auditor-template').html());
				var job_array = res[0]
				var job_array_length = Object.keys(res[0]).length
				for(i=0;i<job_array_length;i++){
					element = job_array[i]
					$("#auditor-list").append(template(element));
				}
				$("#auditor-name-input").attr("disabled","disabled")
				$("#search-auditor").addClass("hide");
				$("#cancel-auditor-search").removeClass("hide")
			})
		}
	}
})


$("#cancel-auditor-search").click(function(){
	load_auditor()
	$("#auditor-name-input").val("");
	$("#auditor-name-input").removeAttr("disabled")
	$(this).addClass("hide")
	$("#cancel-auditor-search").addClass("hide");
	$("#search-auditor").removeClass("hide");


})

