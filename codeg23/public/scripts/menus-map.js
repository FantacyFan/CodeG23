var markers = {};
var color = 0;

function initialize() {
    var mapCanvas = document.getElementById('map-canvas');
    var myLatlng = new google.maps.LatLng(42.448817, -76.476114);
    var mapOptions = {
      center: myLatlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    var menuList = document.getElementsByClassName("list");
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
