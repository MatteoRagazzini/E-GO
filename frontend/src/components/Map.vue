<template>
  <!--  <v-card class="m-auto" >-->
  <!--    <h4>Your position</h4>-->
  <!--    Latitude : {{currPos.lat.toFixed(2)}} , Longitude: {{currPos.lng.toFixed(2)}}-->
  <!--  </v-card>-->
  <div ref="mapDiv" style="width:100%; height:80vh"/>
  <StationCard
    v-model="state.showStationCard"
    :station="state.station"/>
</template>


<!--This is a component realized with the composition API. Which means no return.-->
<!--I would like to write this component like a normal vue component because it's more readable I think-->
<script setup>

import StationService from "@/services/station.service";
import UserService from "@/services/user.service";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useGeolocation} from "@/map/GeolocationFuctions";
import StationCard from "@/components/StationCard";
import { useStore } from 'vuex'
import {useSocketIO} from "@/map/socketComposable";

const {coords} = useGeolocation()
const currPos = computed(() => ({
  lat: coords.value.latitude,
  lng: coords.value.longitude
}))

const store = useStore()
const user = computed(() => store.state.auth.user);
const {socket} = useSocketIO()

const state = reactive({
    markers:[],
    showStationCard: false,
    station: {
      id: 1,
      ratings: 4.5,
      title: "Station example",
      reviews: 400,
    }
  }
);

const mapDiv = ref(null)
let map = ref(null)

onMounted(async () => {
  map.value = new google.maps.Map(mapDiv.value, {
    center: currPos.value,
    zoom: 13,
    mapId: "16c023e99af33056",
  })

  clearMarkers();
  buildMarkers();
  console.log(state.markers.length)
})

function clearMarkers(){
  console.log("entering in clean markers")
  console.log(state.markers.length)
  for(let i = 0; state.markers.length; i++){
    state.markers[i].setMap(null)
  }
}

function buildMarkers(){
  StationService.getStation().then(
    (response) => {
      var stations = response.data
      state.markers = [];
      stations.forEach(station => {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(station.latitude, station.longitude),
          // content: availabilityTag,
          label: "" + (station.totalTowers - station.usedTowers),
          map: map.value
        }).addListener("click", () => {
          state.showStationCard = true
          state.station.id = station._id
          state.station.title = station.address
          state.station.availability = station.usedTowers + "/" + station.totalTowers
          state.station.address = "not a second address"

          UserService.getFavouriteStations(user.value.id).then((response) => {
            var favStations = response.data
            state.station.favorite = favStations.indexOf(station._id) > -1
          })
        });

        state.markers.push(marker)
      })
    })
}

socket.on('welcome', () => {
  console.log("inside cleaning markers")
  clearMarkers()
});

var locationMarker = null;
var locationMarkerIsSet = false;

watch([currPos], () => {
  map.value.setCenter(currPos.value)
  map.value.setZoom(15)
  if (locationMarkerIsSet) {
    console.log("inside the location isSet")
    locationMarker.setMap(null);
  }
  locationMarkerIsSet = true;
  locationMarker = new google.maps.Marker({
    position: new google.maps.LatLng(currPos.value),
    map: map.value,
    icon: {
      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    }
  })
})

</script>

<style>
</style>

