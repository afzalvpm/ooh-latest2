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
    // jwt_token:localStorage['ooh-jwt-token'],
    
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
    for (var key in jobtype) {
      if (jobtype.hasOwnProperty(key)) {
        var html = '<li data-value="'+jobtype[key]+'"><a href="#">'+jobtype[key]+'</a></li>';
        $(".filter-dropdown[data-type='jobtype']").closest(".btn-group").find(".dropdown-menu").append(html)
      }
    }
    for (var key in campaign) {
      if (campaign.hasOwnProperty(key)) {
        var html = '<li data-value="'+campaign[key]['campaign']+'"><a href="#">'+campaign[key]['campaign']+'</a></li>';
        $(".filter-dropdown[data-type='campaign']").closest(".btn-group").find(".dropdown-menu").append(html)
      }
    }
    for (var key in inspectionid) {
      if (inspectionid.hasOwnProperty(key)) {
        var html = '<li data-value="'+inspectionid[key]['inspectionid']+'"><a href="#">'+inspectionid[key]['inspectionid']+'</a></li>';
        $(".filter-dropdown[data-type='inspectionid']").closest(".btn-group").find(".dropdown-menu").append(html)
      }
    }
    for (var key in contractor) {
      if (inspectionid.hasOwnProperty(key)) {
        var html = '<li data-value="'+contractor[key]['contractor']+'"><a href="#">'+contractor[key]['contractor']+'</a></li>';
        $(".filter-dropdown[data-type='contractor']").closest(".btn-group").find(".dropdown-menu").append(html)
      }
    }

    
    for (var key in state) {
      if (state.hasOwnProperty(key)) {
        var html = '<li data-value="'+state[key]+'"><a href="#">'+state[key]+'</a></li>';
        $(".filter-dropdown[data-type='state']").closest(".btn-group").find(".dropdown-menu").append(html)
      }
    }
    for (var key in postalcode) {
      if (postalcode.hasOwnProperty(key)) {
        var html = '<li data-value="'+postalcode[key]+'"><a href="#">'+postalcode[key]+'</a></li>';
        if(postalcode[key] !=null)
          $(".filter-dropdown[data-type='postalcode']").closest(".btn-group").find(".dropdown-menu").append(html)
      }
    }
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        var html = '<li data-value="'+errors[key]+'"><a href="#">'+errors[key]+'</a></li>';
        if(errors[key] !=null)
          $(".filter-dropdown[data-type='errors']").closest(".btn-group").find(".dropdown-menu").append(html)
      }
    }
  })
  // var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
  
  kumulos_init.call('mapviewdropdown',{param:JSON.stringify(post_data),jwt_token:localStorage['ooh-jwt-token']},function(res){
    for(i=0;i<res.length;i++){
      var popup_html = "<span>JOB ID:"+res[i].jobid+"</span></br><span>SITE ID:"+res[i].siteId+"</span></br><span>INSPECTION ID:"+res[i].inspectionid+"</span></br><span>JOB TYPE:"+res[i].jobtype+"</span></br><span>Location:"+res[i].location+"</span></br><span>STATUS:"+res[i].status+"</span>";
      var marker = L.marker([res[i].latitude, res[i].longitude]).addTo(map).bindPopup(popup_html).on('mouseover', function (e) {
        this.openPopup();
      }).on('mouseout', function (e) {
        this.closePopup();
      })
      current_markers.push(marker)
    }
  });
});

$(document).on("click",".map-filter",function(){
  var search = $("#search-area").attr('disabled');
  if (typeof search !== typeof undefined && search !== false) {
    var search_content = $("#search-area").val();
  }else{
    var search_content = "ALL";
  }
  var is_cluster = $(".cluster-button").is(':checked');
  var api_type = $(this).val()
  var post_data = {
    type:api_type,
    param:search_content,
    status:"ALL",
    jwt_token:localStorage['ooh-jwt-token'],
    error:'NONE'
  }
  for(i=0;i<current_markers.length;i++){
    map.removeLayer(current_markers[i]);
    map.removeLayer(markers);
  }
  map.removeLayer(markers);
  markers.clearLayers();
  var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
  kumulos_init.call('mapviewfilter',post_data,function(res){
    if(!is_cluster){
      for(i=0;i<res.length;i++){
        var popup_html = "<span>JOB ID:"+res[i].jobid+"</span></br><span>SITE ID:"+res[i].siteId+"</span></br><span>INSPECTION ID:"+res[i].inspectionid+"</span></br><span>JOB TYPE:"+res[i].jobtype+"</span></br><span>Location:"+res[i].location+"</span></br><span>STATUS:"+res[i].status+"</span>";
        var marker = L.marker([res[i].latitude, res[i].longitude]).addTo(map).bindPopup(popup_html).on('mouseover', function (e) {
          this.openPopup();
        }).on('mouseout', function (e) {
          this.closePopup();
        })
        current_markers.push(marker)
      }
    }else{
      map.removeLayer(markers);
      for(i=0;i<res.length;i++){
        var marker = L.marker(new L.LatLng(res[i].latitude, res[i].longitude), {
          icon: L.mapbox.marker.icon({ 'marker-color': "#0044FF"}),
          title: "Clusters"
        });
        markers.addLayer(marker);
      }
      map.addLayer(markers);
      cluster_marker = markers
    }
  })
});
$(document).on("click","input[name='map-type']",function(){
  var selected_value = $(this).val();
  map.eachLayer(function (layer) {
    if(typeof(layer['_url']) == "string"){
      map.removeLayer(layer);
    }
  });
  // map.setStyle('mapbox://styles/mapbox/' + selected_value + '-v9');
  L.mapbox.styleLayer('mapbox://styles/mapbox/'+selected_value+'-v9').addTo(map);
})


// for(i=0;i<current_markers.length;i++){
//   var latlong = current_markers[i]._latlng
//   var marker = L.marker(new L.LatLng(latlong.lat, latlong.lng), {
//     icon: L.mapbox.marker.icon({ 'marker-color': '#0044FF'}),
//     title: "ssksjsj"
//   });
//   // marker.bindPopup('title');
//   markers.addLayer(marker);
// }
// map.addLayer(markers);

$(document).on("change",".cluster-button",function(){
  var search = $("#search-area").attr('disabled');
  if (typeof search !== typeof undefined && search !== false) {
    var search_content = $("#search-area").val();
  }else{
    var search_content = "ALL";
  }
  var is_cluster = $(this).is(':checked');
  var maptype = $("input[name='map-type']").val();
  var api_type = $(".map-filter").val();
  var post_data = {
    type:api_type,
    param:search_content,
    status:"ALL",
    jwt_token:localStorage['ooh-jwt-token'],
    error:'NONE'
  }
  for(i=0;i<current_markers.length;i++){
    map.removeLayer(current_markers[i]);
  }
  // for(j=0;j<markers;)
  markers.clearLayers()
  var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
  kumulos_init.call('mapviewfilter',post_data,function(res){
    if(!is_cluster){
         // L.mapbox.styleLayer('mapbox://styles/mapbox/'+maptype+'-v9').addTo(map);
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
            title: "ssksjsj"
          });
          markers.addLayer(marker);
        }
        map.addLayer(markers);
        cluster_marker = markers
      }
    })
})



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
  // for(j=0;j<markers;)
  markers.clearLayers()
  var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
  kumulos_init.call('mapsearchbox',post_data,function(res){
    console.log(res)
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
  var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
  kumulos_init.call('mapviewdropdown',{param:JSON.stringify(post_data),jwt_token:localStorage['ooh-jwt-token']},function(res){
    for(i=0;i<res.length;i++){
      var popup_html = "<span>JOB ID:"+res[i].jobid+"</span></br><span>SITE ID:"+res[i].siteId+"</span></br><span>INSPECTION ID:"+res[i].inspectionid+"</span></br><span>JOB TYPE:"+res[i].jobtype+"</span></br><span>Location:"+res[i].location+"</span></br><span>STATUS:"+res[i].status+"</span>";
      var marker = L.marker([res[i].latitude, res[i].longitude]).addTo(map).bindPopup(popup_html).on('mouseover', function (e) {
        this.openPopup();
      }).on('mouseout', function (e) {
        this.closePopup();
      })
      current_markers.push(marker)
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
  var post_data = {
    jobtype:$(".filter-dropdown[data-type='jobtype']").closest(".btn-group").find(" .dropdown-menu li.active").attr("data-value"),
    inspectionid:$(".filter-dropdown[data-type='inspectionid']").closest(".btn-group").find(".dropdown-menu li.active").attr("data-value"),
    state:$(".filter-dropdown[data-type='state']").closest(".btn-group").find(" .dropdown-menu li.active").attr("data-value"),
    postalcode:$(".filter-dropdown[data-type='postalcode']").closest(".btn-group").find(" .dropdown-menu li.active").attr("data-value"),
    contractor:$(".filter-dropdown[data-type='contractor']").closest(".btn-group").find(" .dropdown-menu li.active").attr("data-value"),
    campaign:$(".filter-dropdown[data-type='campaign']").closest(".btn-group").find(" .dropdown-menu li.active").attr("data-value"),
    status:"",
    error:$(".filter-dropdown[data-type='errors']").closest(".btn-group").find(" .dropdown-menu li.active").attr("data-value"),
    startdate:startdate,
    enddate:enddate
    
  }
  var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
  kumulos_init.call('mapviewdropdown',{param:JSON.stringify(post_data),jwt_token:localStorage['ooh-jwt-token']},function(res){
    for(i=0;i<res.length;i++){
      var popup_html = "<span>JOB ID:"+res[i].jobid+"</span></br><span>SITE ID:"+res[i].siteId+"</span></br><span>INSPECTION ID:"+res[i].inspectionid+"</span></br><span>JOB TYPE:"+res[i].jobtype+"</span></br><span>Location:"+res[i].location+"</span></br><span>STATUS:"+res[i].status+"</span>";
      var marker = L.marker([res[i].latitude, res[i].longitude]).addTo(map).bindPopup(popup_html).on('mouseover', function (e) {
        this.openPopup();
      }).on('mouseout', function (e) {
        this.closePopup();
      })
      current_markers.push(marker)
    }
  })


})
$('input[name="daterange"]').on("change",function(){
      $(".button-section .dropdown-menu li")[0].click()
})