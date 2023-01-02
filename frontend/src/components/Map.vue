<template>
  <div id="mapDiv"/>
  <StationCard
    v-model="this.showStationCard"
    :station="this.station"/>
</template>


<!--This is a component realized with the composition API. Which means no return.-->
<!--I would like to write this component like a normal vue component because it's more readable I think-->
<script>
import {useSocketIO} from "@/map/socketComposable";
import UserService from "@/services/user.service";
import StationService from "@/services/station.service";
import StationCard from "@/components/StationCard.vue";

let locationMarker =  null;
let locationMarkerIsSet = false;




export default {
  name: "Map",
  components: {StationCard},
  props:{
    coords:{
      type:Object,
      default(){
        return {lat:48.15143929407981,lng:11.580534476878478}
      },

    }
  },
  data() {
    return {
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
    currentUser() {
      this.user = this.$store.state.auth.user;
      return this.user
    }
  },
  mounted() {
    this.map = new google.maps.Map(document.getElementById("mapDiv"), {
      center: this.coords,
      zoom: 13,
      mapId: "16c023e99af33056",
    })
    this.clearMarkers();
    this.buildMarkers();
  },
  watch:{
    coords: {
      handler(newPos, oldPos) {
        console.log('Prop changed: ', newPos, ' | was: ', oldPos)
        this.map.setCenter(newPos)
        this.map.setZoom(15)
        if (locationMarkerIsSet) {
          console.log("entering in marker is set")
          locationMarker.setMap(null);
          locationMarker = null;
        }
        locationMarkerIsSet = true;
        locationMarker = new google.maps.Marker({
          position: new google.maps.LatLng(this.coords),
          map: this.map,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          }
        })
      },
      deep:true
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
        //   THIS PART NEEDS TO BE CHECKED AND IMPLEMENTED
        //   POTENTIALLY I WOULD LIKE TO MOVE ALL THE POST PROCESSING OF THE PROMISE IN THE SERVICE FILES
        }).catch(error=>{
          console.log(error)
          if(error.response.status===401){
            console.log("trying to push")
            this.$router.push('/login')
          }
      })
    }
  }
}
</script>

<style>
#mapDiv{
  width:100%;
  height: 80vh;
}
</style>

