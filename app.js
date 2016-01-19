
$(window).resize(function() {
  sizeLayerControl();
});

$(".sidebar-toggle-btn").click(function() {
  $("#sidebar").toggle();
  ibgeomap._map.invalidateSize();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  $('#sidebar').hide();
  ibgeomap._map.invalidateSize();
});

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

$('.datetimepicker').datetimepicker();

$.get('map_canvas.json', function (Mapdata) {
    initMap({
        higlightableTag: 'zone',
        labelHideZoom: 10,
        minZoom: 10,
        maxZoom: 28,
        zoom: 10,
        fitBounds: false
    });
    loadMapCanvas(Mapdata);
});
var zoomControl = L.control.zoom({
  position: "topright"
}).addTo(ibgeomap._map);
