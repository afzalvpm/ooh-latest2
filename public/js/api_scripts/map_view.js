      var markers = new L.MarkerClusterGroup();

var current_markers = []
var cluster_marker ="";
var aaa = new L.MarkerClusterGroup()
L.mapbox.accessToken = 'pk.eyJ1IjoiYWZ6YWwiLCJhIjoiY2oyMGx2dzE0MDA1cTJ3cW1kOGVwcG1wdSJ9.dCq8m2ZL0ZOLH1qynjnUwg';
var map = L.mapbox.map('map', 'mapbox.streets',{ zoomControl:false }).setView([-24.994167,134.866944], 5);
$(function(){ 
  var post_data = {
    type:"BOTH",
    param:"ALL",
    status:"ALL",
    jwt_token:localStorage['ooh-jwt-token'],
    error:'NONE'
  }
  var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
  kumulos_init.call('mapviewfilter',post_data,function(res){
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
      console.log(typeof(layer['_url']) == "string")
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
    type:api_type,
    param:search_content,
    status:"ALL",
    jwt_token:localStorage['ooh-jwt-token'],
    error:'NONE'
  }
  for(i=0;i<current_markers.length;i++){
    map.removeLayer(current_markers[i]);
  }
  console.log(post_data)
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
    $("#search-area").attr("disabled","disabled")
  })
})

$(document).on("click","#clear-search",function(){
  $("#search-area").val("")
  $("#search-area").removeAttr("disabled")
  var is_cluster = $(".cluster-button").is(':checked');
  var search_content = $("#search-area").val()
  var api_type = $(".map-filter").val()
  var post_data = {
    type:api_type,
    param:"ALL",
    status:"ALL",
    jwt_token:localStorage['ooh-jwt-token'],
    error:'NONE'
  }
  for(i=0;i<current_markers.length;i++){
    map.removeLayer(current_markers[i]);
  }
  current_markers = [];
  // for(j=0;j<markers;)
  markers.clearLayers()
  console.log(post_data)

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
          title: "Clusters"
        });
        markers.addLayer(marker);
      }
      map.addLayer(markers);
      cluster_marker = markers
    }
  })

})
