function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';
    //Set Report title in first row or line
    
    // CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
    	var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
    	var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
        	row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
    	alert("Invalid data");
    	return;
    }   
    
    //Generate a file name
    var fileName = "ooh_job_report";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/xls;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".xls";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function load_user_jobs(){
	var numberofrecs = 9;
	var max_pagination_elements = 5;
	var post_data = {
		status:"completed",
		numberofrec:numberofrecs,
		offset:0,
		username:"ALL",
		email:"ALL",
		userid:13,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('viewalljobsdetails',post_data,function(res){
			$("#job-list").html("")
			var job_array = res[0]['data']
			var job_array_length = Object.keys(res[0]['data']).length
			var template = _.template($('#job-template').html());
			console.log(job_array)
			for(i=0;i<job_array.length;i++){
				var element = job_array[i]
			// var date = new Date(parseInt(element.completedDate));
			element['endDate'] = moment.utc(parseInt(job_array[i]['endDate'])).format("DD-MM-YYYY HH:mm A");
			$("#job-list").append(template(element));
			$(".view-data h5").text("View Jobs of "+job_array[i].name)

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
			$(".pagination").html(template({items:element_array}));


		}
	})
	}
}

$(document).on("click",".pagination-element",function(){
	$(".pagination-element").removeClass("active")
	$(this).addClass("active")
	var post_data = {
		status:"completed",
		numberofrec:10,
		offset:parseInt($(this).attr("data-index"))*2,
		username:"ALL",
		email:"ALL",
		userid:13,
		jwt_token:localStorage['ooh-jwt-token']
	}
	var template = _.template($('#job-template').html());
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('viewalljobsdetails',post_data,function(res){
			var job_array = res[0]['data']
			var job_array_length = Object.keys(res[0]['data']).length
			if(job_array_length){
				$("#job-list").html("")
				var template = _.template($('#job-template').html());
				for(i=0;i<job_array.length;i++){
					var element = job_array[i]
					element['completeddate'] = moment.utc(parseInt(job_array[i]['completeddate'])).format("DD-MM-YYYY HH:mm A");
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
		current_element.prev().removeClass("hide").addClass("active").click()
	}
})
$(document).on("click",".pagination .next-element",function(e){
	e.preventDefault();
	var current_element = $(".pagination-element.active")
	if(current_element.next().hasClass("pagination-element")){
		$(".pagination-element").not("hide").first("hide");
		current_element.next().removeClass("hide").addClass("active").click()
	}
})

$("#select-all-jobs").on("change",function(e){
	if($(this).is(':checked')){
		$("#job-list").find(".checkbox input").prop("checked",true)
	}else{
		$("#job-list").find(".checkbox input").prop("checked",false)
	}
})
$("#job-list").on("change",".checkbox input",function(){
	$("#select-all-jobs").prop("checked",false)
})

$("#search-job-by-name").click(function(){
	var numberofrecs = 1000;
	var search_content = $("#search-area").val()
	var max_pagination_elements = 6;
	var search_content = $("#search-area").val()
	var post_data = {
		param:search_content,
		numberofrec:numberofrecs,
		offset:0,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		if(search_content.length){
			$(".view-data h5").text("View Jobs of "+search_content)
			var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
			kumulos_init.call('viewcmptdjobsbyuser',post_data,function(res){
				$("#search-area").attr("disabled","disabled")
				$("#job-list").html("")
				if(res[0]['data'].length){
					var template = _.template($('#job-template').html());
					var job_array = res[0]['data']
					var job_array_length = Object.keys(res[0]['data']).length
					for(i=0;i<job_array_length;i++){
						var element = job_array[i]
						element['endDate'] = moment.utc(parseInt(job_array[i]['endDate'])).format("DD-MM-YYYY HH:mm A");
						$("#job-list").append(template(element));
					}
					$(".pagination").addClass("hide")
				}
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

$(function(){ 
	load_user_jobs();
})

// $(".download-data").on("click",function(){
// 	var checked_jobs = $("#job-list tr input:checked");
// 	var columns = ["INSPECTION ID", "JOB ID","SIN","JOB TYPE", "Completed date & time"];
// 	var rows = []

// 	if(checked_jobs.length){
// 		var rows = [
// 		// [1, "Shaw", "Tanzania", ...],
// 		// [2, "Nelson", "Kazakhstan", ...],
// 		// [3, "Garcia", "Madagascar", ...],
// 		// ...
// 		];
// 		for(i=0;i<checked_jobs.length;i++){
// 			var element =[];
// 			var job = $(checked_jobs[i]).closest("tr")
// 			debugger
// 			var job_elements = job.find(".job-element")
// 			for(j=0;j<job_elements.length;j++){
// 				element.push($(job_elements[j]).text())
// 			}
// 			rows.push(element)
// 		}
// 		console.log(rows)
// 		var doc = new jsPDF();
// 		doc.autoTable(columns, rows);
// 		doc.autoTable(columns, rows);
// 		doc.save('table.pdf');

// 	}

// 	// }
// })
$("#select-all-jobs").on("change",function(e){
	if($(this).is(':checked')){
		$("#job-list").find(".checkbox input").prop("checked",true)
	}else{
		$("#job-list").find(".checkbox input").prop("checked",false)
	}
})
$("#job-list").on("change",".checkbox input",function(){
	$("#select-all-jobs").prop("checked",false)
})

// 
$(".download-data").on("click",function(){
	var is_checked_all = $("#select-all-jobs").is(":checked")
	var is_selected = $(".job-element").find("input[type='checkbox']").is(":checked")
	var pdf_data = []
	var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
	kumulos_init.call('cmptdjobsreport',{jwt_token:localStorage['ooh-jwt-token']},function(res){
		console.log(res)
		var coloumns_list = {columnStyles: {
    // suburb: {columnWidth: 100},
    // siteId: {columnWidth: 40},
    // client: {columnWidth: 40},
    // contractor: {columnWidth: 40},
    // start_date: {columnWidth: 40},
    // end_date: {columnWidth: 40},

    // jobID: {columnWidth: 280},
    // name: {columnWidth: 280},
    // applat: {columnWidth: 280},
    // applong: {columnWidth: 180},
    // appsubrub: {columnWidth: 280},
    // appaddress: {columnWidth: 280},
    // zipCode: {columnWidth: 280},
    // jobtype: {columnWidth: 280},
    // proximityCheck: {columnWidth: 280},
    // shareofVoiceCheck: {columnWidth: 280},
    // appnotes: {columnWidth: 180},
    // 17: {columnWidth: 280},
    // 18: {columnWidth: 280},
    // 19: {columnWidth: 280},
    // 20: {columnWidth: 280},
    // 21: {columnWidth: 180},
    // etc
}}
var columns = [{
	title:"Suburb",key:"suburb"},
	{title:"State",key:"siteId"},
	{title:"Advertiser",key:"client"},
	{title:"Agency primary",key:"contractor"},
	{title:"start date",key:"start_date"},
	{title:"end date",key:"end_date"},
	{title:"app job id",key:"jobID"},
	{title:"job accepted by",key:"name"},
	{title:"App job Geo Code latitude",key:"applat"},
	{title:"App job Geo Code longitude",key:"applong"},
	{title:"App Job Suburb",key:"appsubrub"},
	{title:"App Job Post Code",key:"zipCode"},
	{title:"App job Inspection Type",key:"jobtype"},
	{title:"App job Condition PROXIMITY",key:"proximityCheck"},
	{title:"App job Condition SHARE OF VOICE",key:"shareofVoiceCheck"},
	{title:"App job NOTES",key:"appnotes"},
	{title:"Image url",key:"imageurl"},
	{title:"App job Condition GOOD",key:"is_good"},
	{title:"App job Condition NOT POSTED",key:"is_not_posted"},
	{title:"App job Condition NO PANEL",key:"is_not_panel"},
	{title:"App job Condition WRONG PANEL SIDE ",key:"is_wrong_panel_side"			

}]
for(i=0;i<res.length;i++){
	var pdf_element = res[i];
	pdf_element['start_date'] = moment.utc(parseInt(res[i].dateofInspection)).format("DD-MM-YYYY HH:mm A")
	pdf_element['end_date'] = moment.utc(parseInt(res[i].endDate)).format("DD-MM-YYYY HH:mm A")
	pdf_element['is_good'] = false;
	pdf_element['is_not_posted'] = false;
	pdf_element['is_not_panel'] = true;
	pdf_element['is_wrong_panel_side'] = true;

			// 	'end date':moment.utc(parseInt(res[i]['endDate'])).format("DD-MM-YYYY HH:mm A"),
			if(is_checked_all || is_selected ==false){
				pdf_data.push(pdf_element)
			}else{
				var selected_checkboxes = $(".job-element[data-jobid='"+res[i].jobID+"']").find("input[type='checkbox']").is(":checked")
				if(selected_checkboxes == true){
					pdf_data.push(pdf_element)
				}

			}
		}
		var doc = new jsPDF('p','pt','a1');
		doc.autoTable(columns,pdf_data,{})
		doc.setFontSize(2);
		doc.save("jobs-confirmed-report.pdf")
		// console.log(csv_data)
		// JSONToCSVConvertor(csv_data, "", true)

})
	})