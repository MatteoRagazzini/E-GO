<template>
  <!--  <v-card class="m-auto" >-->
  <!--    <h4>Your position</h4>-->
  <!--    Latitude : {{coords.lat.toFixed(2)}} , Longitude: {{coords.lng.toFixed(2)}}-->
  <!--  </v-card>-->
  <div id="mapDiv" style="width:100%; height:80vh"/>
  <StationCard
    v-model="this.showStationCard"
    :station="this.station"/>
</template>


<!--This is a component realized with the composition API. Which means no return.-->
<!--I would like to write this component like a normal vue component because it's more readable I think-->
<script>
import {useGeolocation} from "@/map/GeolocationFuctions";
import {useSocketIO} from "@/map/socketComposable";
import UserService from "@/services/user.service";
import StationService from "@/services/station.service";
import StationCard from "@/components/StationCard.vue";

export default {
  name: "Map",
  components: {StationCard},
  // props:{
  //   coords:{
  //     lat: Number,
  //     lng: Number}
  // },
  data() {
    return {
      coords:{lat:48.1351253, lng: 11.5819806},
      socket: useSocketIO(),
      markers: [],
      showStationCard: false,
      station: {
        id: 1,
        ratings: 4.5,
        title: "Station example",
        reviews: 400,
      },
      map: null
    }
  },
  computed: {
    computed_coords() {
      navigator.geolocation.watchPosition(
        position => {
          return  {
            lat: position.latitude,
            lng: position.longitude
          }
        })
    },
    currentUser() {
      this.user = this.$store.state.auth.user;
      return this.user
    }
  },
  mounted() {
    console.log(this.coords)
    this.map = new google.maps.Map(document.getElementById("mapDiv"), {
      center: this.coords,
      zoom: 13,
      mapId: "16c023e99af33056",
    })
    this.clearMarkers();
    this.buildMarkers();
    console.log(this.markers.length)
  },
  watch:{
    coords(newPos, oldPos) {
      console.log("someone changed the position")
      let locationMarker = null;
      let locationMarkerIsSet = false;
      this.map.setCenter(newPos)
      this.map.setZoom(15)
      if (locationMarkerIsSet) {
        console.log("inside the location isSet")
        locationMarker.setMap(null);
      }
      locationMarkerIsSet = true;
      locationMarker = new google.maps.Marker({
        position: new google.maps.LatLng(coords),
        map: this.map,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
      })
    }
  },
  methods: {
    clearMarkers() {
      console.log("entering in clean markers")
      console.log(this.markers.length)
      for (let i = 0; this.markers.length; i++) {
        this.markers[i].setMap(null)
      }
    },
    buildMarkers() {
      StationService.getStation().then(
        (response) => {
          var stations = response.data
          this.markers = [];
          stations.forEach(station => {
            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(station.latitude, station.longitude),
              // content: availabilityTag,
              label: "" + (station.totalTowers - station.usedTowers),
              map: this.map
            }).addListener("click", () => {
              this.showStationCard = true
              this.station.id = station._id
              this.station.title = station.address
              this.station.availability = station.usedTowers + "/" + station.totalTowers
              this.station.address = "not a second address"

              UserService.getFavouriteStations(this.currentUser.id).then((response) => {
                let favStations = response.data
                this.station.favorite = favStations.indexOf(station._id) > -1
              })
            });

            this.markers.push(marker)
          })
        })
    }
  }
}
</script>

<style>
</style>

