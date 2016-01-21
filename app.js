(function($){
    var socket, id, speed, fromDateTime, toDateTime, diff, player, zoomControl, $id, $from, $to, $speed,

        timerCtx = document.getElementById('timer').getContext('2d');
    timerCtx.fillStyle = 'chartreuse';
    timerCtx.font = "16px Tahoma";

    socket = io.connect('http://contentsrv.ibecom.ru', {path: "/tracker/socket.io"})

    $(".sidebar-toggle-btn").click(function() {
      $("#sidebar").toggle();
      ibgeomap._map.invalidateSize();
      return false;
    });

    $('.datetimepicker').datetimepicker(),

    $from = $('[name="from"]').data("DateTimePicker"),
    $speed = $('[name="speed"]'),
    $id = $('[name="id"]'),
    $to = $('[name="to"]').data("DateTimePicker");

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

    zoomControl = L.control.zoom({
      position: "topright"
    }).addTo(ibgeomap._map);

    $('#play').on('click', function(){
        fromDateTime = $from.date().unix()*1000;
        toDateTime = $to.date().unix()*1000;
        speed = parseInt($speed.val());
        id = parseInt($id.val()) || 3;
        player = new Player(fromDateTime, toDateTime, timerCtx, speed);
        start();
    })
    $('#stop').on('click', function(){
        fromDateTime = null;
        toDateTime = null;
        speed = null;
        id = null;
        player && player.stop();
        player = null;
    })

    socket.on('load-track', function (trackData) {
        if (trackData.length === 0) {
            return;
        }
        player.load(trackData);
        console.log(player.getQueue().getLength());
    });
    function start() {
        socket.emit('load-track', {
            appId: id,
            startTimeStamp: fromDateTime,
            endTimeStamp: toDateTime
        });
        //for(var n = 0; n < 7; n++){
        //    $.get('td'+n+'.json', function (trackData) {
        //        if (trackData.length === 0) {
        //            return;
        //        }
        //        player.load(trackData);
        //        console.log(player.getQueue().getLength());
        //    });
        //}
    }
}(jQuery))