var markers = {};
var color = 0;

function setGeo(position){

}

function initialize() {
    var mapCanvas = document.getElementById('map-canvas');
    var position = {};
    position["coords"] = {};
    var thisLat = 42.448817;
    var thisLng = -76.476114;
    if(mapCanvas.getAttribute("lat")=="undefined"){
        position["coords"]["latitude"] = thisLat;
        position["coords"]["longitude"] = thisLng;
        createMap(position);
        if(navigator.geolocation){
            currLocaction = navigator.geolocation.getCurrentPosition(createMap);
        }
    } else {
        thisLat = mapCanvas.getAttribute("lat");   
        thisLng = mapCanvas.getAttribute("lng");
        position["coords"]["latitude"] = thisLat;
        position["coords"]["longitude"] = thisLng;
        createMap(position);
    }
}

function createMap(position){
    var mapCanvas = document.getElementById('map-canvas');
    var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = {
      center: myLatlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    var menuList = document.getElementsByClassName("eight wide column list");
    for(i = 0; i < menuList.length; i++) {
        markers[menuList[i].id] = new google.maps.Marker({
            position : new google.maps.LatLng(menuList[i].getAttribute("lat"),menuList[i].getAttribute("lng")),
            map: map,
            title: menuList[i].id
        })
        markers[menuList[i].id].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    }
}

$('.list')
	.on("mouseenter", function(){
		markers[this.id].setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
	})
	.on("mouseleave", function(){
		markers[this.id].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
	})

google.maps.event.addDomListener(window, 'load', initialize);
