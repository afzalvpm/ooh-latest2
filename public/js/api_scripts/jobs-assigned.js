
var current_markers = []
L.mapbox.accessToken = 'pk.eyJ1IjoiYWZ6YWwiLCJhIjoiY2oyMGx2dzE0MDA1cTJ3cW1kOGVwcG1wdSJ9.dCq8m2ZL0ZOLH1qynjnUwg';
var map = L.mapbox.map('map-area', 'mapbox.streets').setView([-24.994167,134.866944], 4);

$(document).on("click",".pagination-element",function(){
	
})
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
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('viewassignedjobs',post_data,function(res){
			console.log( res[0]['data'])
			var job_array = res[0]['data']
			var job_array_length = Object.keys(res[0]['data']).length
			if(job_array_length){
				$("#job-list").html("")				
				var template = _.template($('#job-template').html());
				for(i=0;i<job_array.length;i++){
					var element = job_array[i];
					element['state'] = element['statePostalCode'].split(" ")[0]
					element['PostalCode'] = element['statePostalCode'].split(" ")[1]
					var date = new Date(parseInt(element.completedDate));
				element['startdate'] = moment.utc(parseInt(job_array[i]['startDate'])*1000).format("DD-MM-YYYY HH:mm A");
					element['enddate'] = moment.utc(parseInt(job_array[i]['endDate'])*1000).format("DD-MM-YYYY HH:mm A");
					$("#job-list").append(template(element));
					$("#end-date-time-picker"+i).datetimepicker({format: 'dd-mm-yyyy HH:ii P',showMeridian: true,autoclose: true}).on('changeDate', function(ev){
					$(ev.currentTarget).closest(".job-parent").find(".job-element[data-type='location']").blur();

				});
				$("#start-date-time-picker"+i).datetimepicker({format: 'dd-mm-yyyy HH:ii P',showMeridian: true,autoclose: true}).on('changeDate', function(ev){
					$(ev.currentTarget).closest(".job-parent").find(".job-element[data-type='location']").blur();

				});
				}
			}
		})
	}
}

$(function(){ 
	var numberofrecs = $("#pagination-limit").val();
	var max_pagination_elements = 5;
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
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('viewassignedjobs',post_data,function(res){
			console.log(res)
			$("#job-list").html("")
			var job_array = res[0]['data']
			var job_array_length = Object.keys(res[0]['data']).length
			var template = _.template($('#job-template').html());
			for(i=0;i<job_array_length;i++){
				var element = job_array[i]
				element['state'] = element['statePostalCode'].split(" ")[0]
				element['PostalCode'] = element['statePostalCode'].split(" ")[1]
				var date = new Date(parseInt(element.completedDate));
				element['startdate'] = moment.utc(parseInt(job_array[i]['startDate'])*1000).format("DD-MM-YYYY HH:mm A");
				element['enddate'] = moment.utc(parseInt(job_array[i]['endDate'])*1000).format("DD-MM-YYYY HH:mm A");
				$("#job-list").append(template(element));
				$("#end-date-time-picker"+i).datetimepicker({format: 'dd-mm-yyyy HH:ii P',showMeridian: true,autoclose: true}).on('changeDate', function(ev){
					$(ev.currentTarget).closest(".job-parent").find(".job-element[data-type='location']").blur();

				});
				$("#start-date-time-picker"+i).datetimepicker({format: 'dd-mm-yyyy HH:ii P',showMeridian: true,autoclose: true}).on('changeDate', function(ev){
					$(ev.currentTarget).closest(".job-parent").find(".job-element[data-type='location']").blur();

				});
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
				$(".pagination-section").addClass("hide");
			}
		})
	}
});

$(document).on("click",".view-map",function(){
	var latlon = $(this).closest(".job-parent").find(".job-element[data-type='latlon']").text().split(",")
	var latitude = latlon[0]
	var longitude = latlon[1]
	$("#map-area").locationpicker({
		location: {
			latitude: latitude,
			longitude:longitude
		},
		locationName: "",
		radius: 500,
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: [],
		mapOptions: {},
		scrollwheel: true,
		inputBinding: {
			latitudeInput: null,
			longitudeInput: null,
			radiusInput: null,
			locationNameInput: null
		},
		enableAutocomplete: false,
		enableAutocompleteBlur: false,
		autocompleteOptions: null,
		addressFormat: 'postal_code',
		enableReverseGeocode: true,
		draggable: true,
		onchanged: function(currentLocation, radius, isMarkerDropped) {
			var latitude = currentLocation['latitude'].toFixed(8)
			var longitude = currentLocation['longitude'].toFixed(8)
			$(".job-parent.selected").find(".job-element[data-type='latlon']").text(latitude+","+longitude)
			$("#map-modal").modal('hide');
			$(".job-parent.selected").find(".job-element[data-type='latlon']").blur()
		},
		onlocationnotfound: function(locationName) {},
		oninitialized: function (component) {},
		markerIcon: undefined,
		markerDraggable: true,
		markerVisible : true
	})
	$("#map-modal").modal('show');

})

$(document).on("change","#pagination-limit",function(){
	// $(".pagination").jqPagination('destroy')
	var numberofrecs = parseInt($(this).val())
	var offset = 0;
	$(this).addClass("active")
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
		var template = _.template($('#job-template').html());
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('viewassignedjobs',post_data,function(res){
			console.log(res)
			$("#job-list").html("")
			var job_array = res[0]['data']
			var job_array_length = Object.keys(res[0]['data']).length
			var pagination_limit = res[0]['totalcount']/numberofrecs;
			var no_elements = parseInt(pagination_limit);
			if(pagination_limit.toString().indexOf(".")>0 && pagination_limit>0){
				no_elements +=1 ;
			}
			$(".pagination").jqPagination('option', 'max_page', no_elements);
			$(".pagination").jqPagination('option', 'current_page', 1);

		})

	}
})

$(document).on("click",".job-parent",function(){
	if($(".job-parent.selected").attr("data-id") == $(this).attr("data-id")){
		return
	}else{
		$(".job-parent.selected").removeClass("selected")
		$(this).addClass("selected")
	}
})

$(document).on("blur",".job-element",function(){
	var job_element = $(this).closest(".job-parent").find(".job-element")
	var post_data = {
		jobID:$(this).closest(".job-parent").attr("data-id"),
		startDate:moment($(this).closest(".job-parent").find(".form_datetime1 input").val(), "DD-MM-YYYY HH:mm A").valueOf()/1000,
		endDate:moment($(this).closest(".job-parent").find(".form_datetime2 input").val(), "DD-MM-YYYY HH:mm A").valueOf()/1000,
		jwt_token:localStorage['ooh-jwt-token']
	}
	for(i=0;i<job_element.length;i++){

		post_data[$(job_element[i]).attr("data-type")] = $(job_element[i]).text()
	}
	console.log(post_data)
	jwt_token=localStorage['ooh-jwt-token']
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('updateAssignedJobs',{data:post_data,jwt_token:jwt_token},function(res){
			console.log(res)

		})
	}
})