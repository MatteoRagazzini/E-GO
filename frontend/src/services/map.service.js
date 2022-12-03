import StationService from "@/services/station.service";
import imgUrl from "@/assets/charging-station.png";

let map = null;
let currentPositionMarker = null;

class MapService {

mapInit() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: 48.137154, lng: 11.576124},
      zoom: 13,
      mapId: "16c023e99af33056",
    });

  }

loadStations() {
    StationService.getStation().then(
      (response) => {
        const icon = {
          url: imgUrl, // url
          scaledSize: new google.maps.Size(40, 40), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

        var stations = response.data
        stations.forEach(function (station) {

          const availabilityTag = document.createElement("div");

          if (station.usedSpaces !== station.maxSpaces) {
            availabilityTag.className = "availability-tag available";
          } else {
            availabilityTag.className = "availability-tag unavailable";
          }

          availabilityTag.textContent = station.usedSpaces + "/" + station.maxSpaces;


          console.log(station.latitude + ", " + station.longitude)
          new google.maps.marker.AdvancedMarkerView({
            position: new google.maps.LatLng(station.latitude, station.longitude),
            content: availabilityTag,
            map
          })
        });
      });
  }

showUserLocationOnTheMap(latitude, longitude) {
  if (currentPositionMarker) currentPositionMarker.setMap(null);
  currentPositionMarker = new google.maps.Marker({
    position: new google.maps.LatLng(latitude, longitude),
    map
  })
    map.setCenter(new google.maps.LatLng(latitude,longitude));
    map.setZoom(16);
  }
}

export default new MapService();
