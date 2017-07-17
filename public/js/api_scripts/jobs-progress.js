var current_markers = []
L.mapbox.accessToken = 'pk.eyJ1IjoiYWZ6YWwiLCJhIjoiY2oyMGx2dzE0MDA1cTJ3cW1kOGVwcG1wdSJ9.dCq8m2ZL0ZOLH1qynjnUwg';
var map = L.mapbox.map('map-area', 'mapbox.streets').setView([-24.994167,134.866944], 4);

function update_jobs(page){
	var numberofrec=$("#pagination-limit").val();
	var offset = parseInt(page)*numberofrec;
	$(this).addClass("active")
	var post_data = {
		status:"WIP",
		numberofrec:numberofrec,
		offset:offset,
		username:"ALL",
		email:"ALL",
		userid:0,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		var template = _.template($('#job-template').html());
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('77d8a0b0-b7a1-4e8f-ad51-61f413feb685', 'rqgJTOIfusC6IqQFNAaAinX2VvEyZP0V1E4d');
		kumulos_init.call('viewalljobsdetails',post_data,function(res){
			console.log(res)
			var job_array = res[0]['data']
			var job_array_length = Object.keys(res[0]['data']).length
			if(job_array_length){
				console.log(res)
				$("#job-list").html("")				
				var template = _.template($('#job-template').html());
				for(i=0;i<job_array_length;i++){
					var element = job_array[i]
					element['state'] = element['state']
					element['PostalCode'] = element['postcode']
					var date = new Date(parseInt(element.completedDate));
					element['completeddate'] = moment.utc(parseInt(job_array[i]['endDate'])*1000).format("DD-MM-YYYY HH:mm A");

					$("#job-list").append(template(element));
				}
			}
		})
	}
}

$(function(){ 
	var numberofrecs=$("#pagination-limit").val();;
	var post_data = {
		status:"WIP",
		numberofrec:numberofrecs,
		offset:0,
		username:"ALL",
		email:"ALL",
		userid:0,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('77d8a0b0-b7a1-4e8f-ad51-61f413feb685', 'rqgJTOIfusC6IqQFNAaAinX2VvEyZP0V1E4d');
		kumulos_init.call('viewalljobsdetails',post_data,function(res){
			console.log(res)
			$("#job-list").html("")
			var job_array = res[0]['data']
			var job_array_length = Object.keys(res[0]['data']).length
			var template = _.template($('#job-template').html());
			for(i=0;i<job_array_length;i++){
				var element = job_array[i]
				element['state'] = element['state']
				element['PostalCode'] = element['postcode']
				var date = new Date(parseInt(element.completedDate));
				element['completeddate'] = moment.utc(parseInt(job_array[i]['endDate'])*1000).format("DD-MM-YYYY HH:mm A");
				$("#job-list").append(template(element));
			}
			var pagination_limit = res[0]['totalcount']/numberofrecs;
			var no_elements = parseInt(pagination_limit);
			if(pagination_limit.toString().indexOf(".")>0 && pagination_limit>0){
				no_elements +=1 ;
			}
			if(no_elements>1 && job_array_length){
				$('.pagination').find("input").attr("data-max-page",no_elements)
				$('.pagination').jqPagination({
					paged: function(page) {
						update_jobs(page-1);
					}
				});
			}else{
				$('.pagination-section').addClass("hide");
			}
			
		})
	}
});

$(document).on("click",".view-map",function(){
	var job_element = $(this).closest("tr");
	var auditor_name = job_element.find(".userName").text()
	var jobid = job_element.find(".jobId").text()
	var siteId = job_element.find(".siteId").text()
	var completeness = job_element.find(".progress-bar").attr("aria-valuenow")
	var location = job_element.find(".location").text()
	var job_latitude = $(this).attr("data-latitude");
	var job_longitude = $(this).attr("data-longitude");
	var auditor_latitude = $(this).attr("data-auditorlatitude");
	var auditor_longitude = $(this).attr("data-auditorlongitude");
	var jobtype =job_element.attr("data-type")
	for(i=0;i<current_markers.length;i++){
		map.removeLayer(current_markers[i]);
	}
	var popup_html = "<span>JOB ID:"+jobid+"</span></br><span>SITE ID:"+siteId+"</span></br><span>Completeness:"+completeness+"%</span></br><span>JOB TYPE:"+jobtype+"</span></br><span>Location:"+location+"</span></br>";
    // var popup_html = "<span>JOB ID:"+res[i].jobid+"</span></br><span>SITE ID:"+res[i].siteId+"</span></br><span>INSPECTION ID:"+res[i].inspectionid+"</span></br><span>JOB TYPE:"+res[i].jobtype+"</span></br><span>Location:"+res[i].location+"</span></br><span>STATUS:"+res[i].status+"</span>";

    var job_marker = L.marker([job_latitude, job_longitude]).addTo(map).bindPopup(popup_html).on('mouseover', function (e) {
    	this.openPopup();
    }).on('mouseout', function (e) {
    	this.closePopup();
    })
    current_markers.push(job_marker)
    var auditor_text = "<span>AUDITOR NAME:"+auditor_name+"</span></br>"
    var auditormarker = L.marker([auditor_latitude, auditor_longitude]).addTo(map).bindPopup(auditor_text).on('mouseover', function (e) {
    	this.openPopup();
    }).on('mouseout', function (e) {
    	this.closePopup();
    })
    current_markers.push(auditormarker)
    $("#map-modal").modal('show');
    setTimeout(function(){
    	map.invalidateSize();
    },1000)

})