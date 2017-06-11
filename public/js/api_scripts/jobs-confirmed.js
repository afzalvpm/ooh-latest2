function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			
			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';
			
			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

/* original data */

function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}


/* add worksheet to workbook */

function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
}

function load_completed_jobs(){
	var numberofrecs = 9;
	var max_pagination_elements = 5;
	var post_data = {
		status:"completed",
		numberofrec:numberofrecs,
		offset:0,
		username:"ALL",
		email:"ALL",
		userid:0,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('viewalljobsdetails',post_data,function(res){
			$("#job-list").html("")
			var job_array = res[0]['data']
			console.log(job_array)
			var job_array_length = Object.keys(res[0]['data']).length
			var template = _.template($('#job-template').html());
			for(i=0;i<job_array.length;i++){
				var element = job_array[i]
				element['completeddate'] = moment.utc(parseInt(job_array[i]['completedDate'])*1000).format("DD-MM-YYYY HH:mm A");
				$("#job-list").append(template(element));
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
	var numberofrec = 9;
	var offset = parseInt($(this).attr("data-index"))*numberofrec;
	$(this).addClass("active")
	var post_data = {
		status:"completed",
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
		kumulos_init.call('viewalljobsdetails',post_data,function(res){
			var job_array = res[0]['data']
			var job_array_length = Object.keys(res[0]['data']).length
			if(job_array_length){
				$("#job-list").html("");
				var template = _.template($('#job-template').html());
				for(i=0;i<job_array.length;i++){
					var element = job_array[i]
					element['completeddate'] = moment.utc(parseInt(job_array[i]['completedDate'])*1000).format("DD-MM-YYYY HH:mm A");
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

	$('.pagination > .pagination-element').not(".hide").last().click()
})
$(document).on("click",".pagination .first-element",function(e){
	e.preventDefault();
	$('.pagination > .pagination-element').addClass("hide");
	$('.pagination > .pagination-element').slice(0,5).removeClass("hide");
	$('.pagination > .pagination-element').not(".hide").first().click()
})
$(document).on("click",".pagination .previous-element",function(e){
	e.preventDefault();
	var current_element = $(".pagination-element.active")
	if(current_element.prev().hasClass("pagination-element")){
		if($(".pagination > .pagination-element").not(".hide").length>5)
			$(".pagination > .pagination-element").not(".hide").last().addClass("hide")
		current_element.prev().removeClass("hide").addClass("active").click()
	}
})
$(document).on("click",".pagination .next-element",function(e){
	e.preventDefault();
	var current_element = $(".pagination-element.active")
	if(current_element.next().hasClass("pagination-element")){
		if($(".pagination > .pagination-element").not(".hide").length>5)
			$(".pagination > .pagination-element").not(".hide").first().addClass("hide")
		current_element.next().removeClass("hide").addClass("active").click()
	}
})



$(function(){ 
	load_completed_jobs()
});


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

$(".download-data").on("click",function(){
	var is_checked_all = $("#select-all-jobs").is(":checked")
	var is_selected = $(".job-element").find("input[type='checkbox']").is(":checked")
	var pdf_data = []
	var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
	kumulos_init.call('cmptdjobsreport',{jwt_token:localStorage['ooh-jwt-token']},function(res){
		var headers = ['FaceNumber','MoveID','FusionID','Suburb','State PostCode','SiteNumber','FaceDescription','FaceSize','ProductName','SalesContractNumber','CampaignName','Advertiser','Brand','AgencyPrimary','StartDate','EndDate','DurationDays','Daypart','FaceSpotLenth','FacePackName','App Job ID','App Job Acepted by','App Job accepted time','App job Geo Code latitude','App Job Geocode Longitude','App Job Address','App Job Post Code ','App job Inspection Type ','App job Condition GOOD','App job Condition NO PANEL ','App job Condition NOT POSTED','App job Condition DAMAGED ','App job Condition WRONG PANEL SIDE ','App job Condition OBSTRUCTED ','App job Condition NON ILLUMINATION ','App job Condition PROXIMITY ','App job Condition SHARE OF VOICE ','App job NOTES']
		// var headers = ["Suburb","State","Advertiser","Agency primary","start date","end date","app job id","job accepted by","App job Geo Code latitude","App job Geo Code longitude","App Job Suburb","App Job Post Code","App job Inspection Type","App job Condition PROXIMITY","App job Condition SHARE OF VOICE","App job NOTES","Image url","App job Condition GOOD","App job Condition NOT POSTED","App job Condition WRONG PANEL SIDE "]
		pdf_data.push(headers)
		for(i=0;i<res.length;i++){
			var pdf_element = res[i];
			pdf_element['start_date'] = moment.utc(parseInt(res[i].dateofInspection)*1000).format("DD-MM-YYYY HH:mm A")
			pdf_element['end_date'] = moment.utc(parseInt(res[i].endDate)*1000).format("DD-MM-YYYY HH:mm A")
			pdf_element['job_acceptedtime'] = moment.utc(parseInt(res[i].appjobacceptedtime)*1000).format("DD-MM-YYYY HH:mm A")
			var status = pdf_element.conditionalDetails.toUpperCase();
			var is_good = status.indexOf("GOOD")>-1?true:false;
			var is_not_panel = status.indexOf("NO PANEL")>-1?true:false;
			var is_not_posted = status.indexOf("NOT POSTED")>-1?true:false;
			var is_wrong_panel_side = status.indexOf("WRONG PANEL SIDE")>-1?true:false;
			var is_obstructed = status.indexOf("OBSTRUCTED")>-1?true:false;
			var is_non_illumination = status.indexOf("NON ILLUMINATION")>-1?true:false;
			var is_damaged = status.indexOf("DAMAGED")>-1?true:false;
			var xls_element = [pdf_element.panalId,pdf_element.moveId,pdf_element.fusionId,pdf_element.suburb,pdf_element.statepostalcode,pdf_element.siteId,pdf_element.location,pdf_element.faceSize,pdf_element.productName,pdf_element.salesContractNumber,pdf_element.campaign,pdf_element.advertiser,pdf_element.brand,pdf_element.agency,pdf_element.start_date,pdf_element.end_date,pdf_element.durationDays,pdf_element.daypart,pdf_element.faceSpotLenth,pdf_element.facePackName,pdf_element.appjobid,pdf_element.name,pdf_element.job_acceptedtime,pdf_element.applat,pdf_element.applong,pdf_element.applocation,pdf_element.zipCode,pdf_element.jobtype,is_good,is_not_panel,is_not_posted,is_damaged,is_wrong_panel_side,is_obstructed,is_non_illumination,pdf_element.proximityCheck,pdf_element.shareofVoiceCheck,pdf_element.appnotes]
			if(is_checked_all || is_selected == false){
				pdf_data.push(xls_element)
			}else{
				var selected_checkboxes = $(".job-element[data-jobid='"+res[i].jobID+"']").find("input[type='checkbox']").is(":checked")
				if(selected_checkboxes == true){
					pdf_data.push(xls_element)
				}

			}
		}
		var wb = new Workbook(), ws = sheet_from_array_of_arrays(pdf_data);

		/* add worksheet to workbook */
		ws_name = "Sheets"
		wb.SheetNames.push(ws_name);
		wb.Sheets[ws_name] = ws;
		var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
		saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "jobs-confirmed-report.xlsx")

	})

})
$("#search-job-by-name").click(function(){
	var numberofrecs = 9;
	var max_pagination_elements = 6;
	var search_content = $("#search-area").val()
	$(".download-data").addClass("hide")
	var post_data = {
		nameorid:search_content,
		jwt_token:localStorage['ooh-jwt-token']
	}
	if(typeof(localStorage['ooh-jwt-token'])!=undefined){
		if(search_content.length){
			var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
			kumulos_init.call('viewcmptdjobsbyuser',post_data,function(res){
				$("#job-list").html("")
				var template = _.template($('#job-template').html());
				var job_array = res
				for(i=0;i<job_array.length;i++){
					element = job_array[i]
					element['completeddate'] = moment.utc(parseInt(job_array[i]['endDate'])*1000).format("DD-MM-YYYY HH:mm A");
					element['client'] = ''
					element['contractor'] = ''
					element['dateofInspection'] = ''
					element['zipCode'] = ''
					element['proximityCheck'] = ''
					element['shareofVoiceCheck'] = ''
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
	load_completed_jobs();
	$("#search-area").val("")
	$("#search-area").removeAttr("disabled")
	$(".pagination").removeClass("hide")

})

$("#select-all-jobs").on("change",function(e){
	if($(this).is(':checked')){
		$("#job-list").find(".checkbox input").prop("checked",true)
		$(".download-data").removeClass("hide")
	}else{
		$("#job-list").find(".checkbox input").prop("checked",false)
		$(".download-data").addClass("hide")

	}
})
$("#job-list").on("change",".checkbox input",function(){
	$("#select-all-jobs").prop("checked",false)
	if($("#job-list .checkbox input").is(":checked")){
		$(".download-data").removeClass("hide")
	}else{
		$(".download-data").addClass("hide")
	}
})
