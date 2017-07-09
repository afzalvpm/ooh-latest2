var markers = new L.MarkerClusterGroup();
var current_markers = []
var cluster_marker ="";
var aaa = new L.MarkerClusterGroup()
L.mapbox.accessToken = 'pk.eyJ1IjoiYWZ6YWwiLCJhIjoiY2oyMGx2dzE0MDA1cTJ3cW1kOGVwcG1wdSJ9.dCq8m2ZL0ZOLH1qynjnUwg';
var map = L.mapbox.map('map', 'mapbox.streets',{ zoomControl:false }).setView([-24.994167,134.866944], 5);
$(function(){
  $('input[name="daterange"]').daterangepicker({
    locale: {
      format: 'YYYY/MM/DD'
    },
    startDate: '2017/01/01',
    endDate: '2020/12/31',
    function(start, end, label) {

    }
  })
  var post_data = {
    jobtype:"",
    inspectionid:"",
    state:"",
    postalcode:"",
    contractor:"",
    campaign:"",
    status:"",
    error:"",
    startDate: '2017/01/01',
    endDate: '2020/12/31',
    
  }
  var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
  kumulos_init.call('mapdropdowndata',{jwt_token:localStorage['ooh-jwt-token']},function(res){
    var response = res[0]
    var jobtype = response['jobtype']
    var campaign = response['campaign']
    var errors = response['errors']
    var inspectionid = response['inspectionid']
    var contractor = response['contractor']
    var postalcode = response['postalcode']
    var state = response['state']
    var status = response['status']
    for (var key in jobtype) {
      if (jobtype.hasOwnProperty(key)) {
        var html = '<option data-value="'+jobtype[key]+'" value="'+jobtype[key]+'">'+jobtype[key]+'</option>';
        // debugger
        $("#jobtype-filter").append(html)
      }
    }
        $('#jobtype-filter').multiselect({includeSelectAllOption: true,selectAllText: 'Select All',nonSelectedText: 'Job Type'  });
    for (var key in campaign) {
      if (campaign.hasOwnProperty(key)) {
        var html = '<option data-value="'+campaign[key]['campaign']+'" value="'+campaign[key]['campaign']+'">'+campaign[key]['campaign']+'</option>';
        $("#campaign-filter").append(html)
      }
    }
     $("#campaign-filter").multiselect({includeSelectAllOption: true,
  selectAllText: 'Select All',nonSelectedText: 'Campaign'  });
    for (var key in inspectionid) {
      if (inspectionid.hasOwnProperty(key)) {
        // inspectionid-filter
        var html = '<option data-value="'+inspectionid[key]['inspectionid']+'" value="'+inspectionid[key]['inspectionid']+'">'+inspectionid[key]['inspectionid']+'</option>';
        $("#inspectionid-filter").append(html)
      }
    }
    $('#inspectionid-filter').multiselect({includeSelectAllOption: true,
  selectAllText: 'Select All',nonSelectedText: 'Inspection ID'  });
    for (var key in contractor) {
      if (inspectionid.hasOwnProperty(key)) {
        var html = '<option data-value="'+contractor[key]['contractor']+'" value="'+contractor[key]['contractor']+'">'+contractor[key]['contractor']+'</option>';
        // debugger
        $("#contractor-filter").append(html)
      }
    }
    $("#contractor-filter").multiselect({includeSelectAllOption: true,
  selectAllText: 'Select All',nonSelectedText: 'Contractor'  });

    
    for (var key in state) {
      if (state.hasOwnProperty(key)) {
        var html = '<option data-value="'+state[key]+'" value="'+state[key]+'">'+state[key]+'</li>';
        $("#state-filter").append(html)
        // $(".filter-dropdown[data-type='state']").closest(".btn-group").find(".dropdown-menu").append(html)
      }
    }
         $("#state-filter").multiselect({includeSelectAllOption: true,selectAllText: 'Select All',nonSelectedText: 'State'  });

    for (var key in postalcode) {
      if (postalcode.hasOwnProperty(key)) {
        if(postalcode[key] !=null){
          var html = '<option data-value="'+postalcode[key]+'" value="'+postalcode[key]+'">'+postalcode[key]+'</li>';
          $("#postalcode-filter").append(html)
        }
      }
    }
         $("#postalcode-filter").multiselect({includeSelectAllOption: true,selectAllText: 'Select All',nonSelectedText: 'Postal Code'  });

    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if(errors[key] !=null){
        var html = '<option data-value="'+errors[key]+'" value="'+errors[key]+'">'+errors[key]+'</li>';
          $("#errors-filter").append(html)
        }
      }
    }
    $("#errors-filter").multiselect({includeSelectAllOption: true,selectAllText: 'Select All',nonSelectedText: 'Errors'  });

    for (var key in status) {
      if (errors.hasOwnProperty(key)) {
        if(status[key] !=null)
          var html = '<option data-value="'+status[key]+'" value="'+status[key]+'">'+status[key]+'</li>';
        $("#status-filter").append(html)
          $("#status-filter").append(html)
      }
    }
    $("#status-filter").multiselect({includeSelectAllOption: true,selectAllText: 'Select All',nonSelectedText: 'Status'  });
  })
  // var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
  
  // kumulos_init.call('mapviewdropdown',{param:JSON.stringify(post_data),jwt_token:localStorage['ooh-jwt-token']},function(res){
  //   alert("SSJSJ")
  //   for(i=0;i<res.length;i++){
  //     var popup_html = "<span>JOB ID:"+res[i].jobid+"</span></br><span>SITE ID:"+res[i].siteId+"</span></br><span>INSPECTION ID:"+res[i].inspectionid+"</span></br><span>JOB TYPE:"+res[i].jobtype+"</span></br><span>Location:"+res[i].location+"</span></br><span>STATUS:"+res[i].status+"</span>";
  //     var marker = L.marker([res[i].latitude, res[i].longitude],{iconUrl: ""}).addTo(map).bindPopup(popup_html).on('mouseover', function (e) {
  //       this.openPopup();
  //     }).on('mouseout', function (e) {
  //       this.closePopup();
  //     })
  //     current_markers.push(marker)
  //   }
  // });
});




$(document).on("click","#search-job-by-name",function(){
  var is_cluster = $(".cluster-button").is(':checked');
  var search_content = $("#search-area").val()
  var api_type = $(".map-filter").val()
  var post_data = {
    param:search_content,
    jwt_token:localStorage['ooh-jwt-token'],
  }
  for(i=0;i<current_markers.length;i++){
    map.removeLayer(current_markers[i]);
  }
  markers.clearLayers()
  
  $(".filter-dropdown").not(".maptype-dropdown").closest(".btn-group").find(".dropdown-menu li.active").removeClass("active")
  $(".filter-dropdown").not(".maptype-dropdown").closest(".btn-group").find(".dropdown-menu li[data-value='']").addClass("active")
  var is_cluster = $(".filter-dropdown[data-type='maptype']").closest(".btn-group").find(".dropdown-menu li.active").attr("data-value").length
  var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
  kumulos_init.call('mapsearchbox',post_data,function(res){
    if(!is_cluster){
     for(i=0;i<res.length;i++){
      var popup_html = "<span>JOB ID:"+res[i].jobid+"</span></br><span>SITE ID:"+res[i].siteId+"</span></br><span>INSPECTION ID:"+res[i].inspectionid+"</span></br><span>JOB TYPE:"+res[i].jobtype+"</span></br><span>Location:"+res[i].location+"</span></br><span>STATUS:"+res[i].status+"</span>";
      var marker = L.marker([res[i].latitude, res[i].longitude]).addTo(map).bindPopup(popup_html).on('mouseover', function (e) {
        this.openPopup();
      }).on('mouseout', function (e) {
        this.closePopup();
      })
      current_markers.push(marker)
      var maptype = $("input[name='map-type']").val()
    }

  }else{
    L.mapbox.styleLayer('mapbox://styles/mapbox/dark-v9').addTo(map);
    for(i=0;i<res.length;i++){
      var marker = L.marker(new L.LatLng(res[i].latitude, res[i].longitude), {
        icon: L.mapbox.marker.icon({ 'marker-color': "#fff"}),
        title: "Map View"
      });
      markers.addLayer(marker);
    }
    map.addLayer(markers);
    cluster_marker = markers
  }
  $("#search-area").attr("disabled","disabled")
})
})

$(document).on("click","#clear-search",function(){
  $("#search-area").val("")
  $("#search-area").removeAttr("disabled")
  var post_data = {
    jobtype:"",
    inspectionid:"",
    state:"",
    postalcode:"",
    contractor:"",
    campaign:"",
    status:"",
    error:"",
    startDate: '2017/01/01',
    endDate: '2020/12/31',
  }
  var is_cluster = $(".filter-dropdown[data-type='maptype']").closest(".btn-group").find(".dropdown-menu li.active").attr("data-value").length
  var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
  kumulos_init.call('mapviewdropdown',{param:JSON.stringify(post_data),jwt_token:localStorage['ooh-jwt-token']},function(res){
    if(!is_cluster){
     for(i=0;i<res.length;i++){
      var popup_html = "<span>JOB ID:"+res[i].jobid+"</span></br><span>SITE ID:"+res[i].siteId+"</span></br><span>INSPECTION ID:"+res[i].inspectionid+"</span></br><span>JOB TYPE:"+res[i].jobtype+"</span></br><span>Location:"+res[i].location+"</span></br><span>STATUS:"+res[i].status+"</span>";
      var marker = L.marker([res[i].latitude, res[i].longitude]).addTo(map).bindPopup(popup_html).on('mouseover', function (e) {
        this.openPopup();
      }).on('mouseout', function (e) {
        this.closePopup();
      })
      current_markers.push(marker)
      var maptype = $("input[name='map-type']").val()
    }

  }else{
    L.mapbox.styleLayer('mapbox://styles/mapbox/dark-v9').addTo(map);
    for(i=0;i<res.length;i++){
      var marker = L.marker(new L.LatLng(res[i].latitude, res[i].longitude), {
        icon: L.mapbox.marker.icon({ 'marker-color': "#fff"}),
        title: "Map View"
      });
      markers.addLayer(marker);
    }
    map.addLayer(markers);
    cluster_marker = markers
  }
});
  
})

$(document).on("click",".button-section .dropdown-menu li",function(e){
  e.preventDefault();
  $(this).closest("ul").find("li").removeClass("active");
  $(this).addClass("active");
  var daterange_value = $("#daterange").val().replace(/\s/g, '');
  var startdate = "";
  var enddate = "";
  if(daterange_value!="" && daterange_value.indexOf("-")>-1){
    startdate = daterange_value.split("-")[0]
    enddate = daterange_value.split("-")[1]
  }
  for(i=0;i<current_markers.length;i++){
    map.removeLayer(current_markers[i]);
    // map.removeLayer(markers);
  }
  map.removeLayer(markers);
  markers.clearLayers();
  var post_data = {
    jobtype:$(".filter-dropdown[data-type='jobtype']").closest(".btn-group").find(" .dropdown-menu li.active").attr("data-value"),
    inspectionid:$(".filter-dropdown[data-type='inspectionid']").closest(".btn-group").find(".dropdown-menu li.active").attr("data-value"),
    state:$(".filter-dropdown[data-type='state']").closest(".btn-group").find(" .dropdown-menu li.active").attr("data-value"),
    postalcode:$(".filter-dropdown[data-type='postalcode']").closest(".btn-group").find(" .dropdown-menu li.active").attr("data-value"),
    contractor:$(".filter-dropdown[data-type='contractor']").closest(".btn-group").find(" .dropdown-menu li.active").attr("data-value"),
    campaign:$(".filter-dropdown[data-type='campaign']").closest(".btn-group").find(" .dropdown-menu li.active").attr("data-value"),
    status:$(".filter-dropdown[data-type='status']").closest(".btn-group").find(" .dropdown-menu li.active").attr("data-value"),
    error:$(".filter-dropdown[data-type='errors']").closest(".btn-group").find(" .dropdown-menu li.active").attr("data-value"),
    startdate:startdate,
    enddate:enddate
    
  }
  var is_cluster = $(".filter-dropdown[data-type='maptype']").closest(".btn-group").find(".dropdown-menu li.active").attr("data-value").length
  var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
  kumulos_init.call('mapviewdropdown',{param:JSON.stringify(post_data),jwt_token:localStorage['ooh-jwt-token']},function(res){
    if(!is_cluster){
      L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v9').addTo(map);
      for(i=0;i<res.length;i++){
        var popup_html = "<span>JOB ID:"+res[i].jobid+"</span></br><span>SITE ID:"+res[i].siteId+"</span></br><span>INSPECTION ID:"+res[i].inspectionid+"</span></br><span>JOB TYPE:"+res[i].jobtype+"</span></br><span>Location:"+res[i].location+"</span></br><span>STATUS:"+res[i].status+"</span>";
        var marker = L.marker([res[i].latitude, res[i].longitude]).addTo(map).bindPopup(popup_html).on('mouseover', function (e) {
          this.openPopup();
        }).on('mouseout', function (e) {
          this.closePopup();
        })
        current_markers.push(marker)
        var maptype = $("input[name='map-type']").val()
      }

    }else{
      L.mapbox.styleLayer('mapbox://styles/mapbox/dark-v9').addTo(map);
      for(i=0;i<res.length;i++){
        var marker = L.marker(new L.LatLng(res[i].latitude, res[i].longitude), {
          icon: L.mapbox.marker.icon({ 'marker-color': "#fff"}),
          title: "Map View"
        });
        markers.addLayer(marker);
      }
      map.addLayer(markers);
      cluster_marker = markers
    }
  })


})
$('input[name="daterange"]').on("change",function(){
  $(".button-section .dropdown-menu li")[0].click()
})
