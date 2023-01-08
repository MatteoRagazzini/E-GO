<template>
<!--  <v-btn @click="this.clearMarkers">delete</v-btn>-->
  <div id="mapDiv"/>
  <StationCard
    v-model="this.showStationCard"
    @close="this.showStationCard = false"
    @switchTab="switchTab"
    :station="this.station"/>
</template>


<script>
import UserService from "@/services/user.service";
import StationService from "@/services/station.service";
import StationCard from "@/components/StationCard.vue";
import yellow_marker_url from "@/assets/yellow-marker.png"
import green_marker_url from "@/assets/green-marker.png"

let locationMarker = null;
let locationMarkerIsSet = false;
let StationsMarkers = [];
let map


export default {
  name: "Map",
  components: {StationCard},
  props: {
    coords: {
      type: Object,
      default() {
        return {lat: 48.15143929407981, lng: 11.580534476878478}
      },

    }
  },
  data() {
    return {
      showStationCard: false,
      // to be passed to the station card
      station: {},
    }
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    ChangeMarker: function (data) {
      console.log("[MAP] receive ChangeMarker: ", data)
      // let markerToChange = markers.find(m=>m.id === data.station)
      // console.log(markerToChange)
      // markerToChange.usedTowers ++;
      // markerToChange.marker.setMap(null)
      this.clearMarkers()
      if(data === 'inc')this.station.usedTowers++
      else if (data === 'dec') this.station.usedTowers--
      this.buildMarkers()
    }
  },
  computed: {
    currentUser() {
      this.user = this.$store.state.auth.user;
      return this.user
    },
    // retrieve from the store which is always up to date with the backend the stations occupied by the user
    userStationReserved(){
      return  this.$store.state.userState.status === "reserved" ? this.$store.state.userState.station : ""
    },
    userStationCharging(){
      return  this.$store.state.userState.status === "connected" ? this.$store.state.userState.station : ""
    }
  },
  mounted() {
    map = new google.maps.Map(document.getElementById("mapDiv"), {
      center: this.coords,
      zoom: 13,
      mapId: "16c023e99af33056",
    })
    this.clearMarkers();
    this.buildMarkers();
  },
  watch: {
    coords: {
      handler(newPos, oldPos) {
        console.log('Prop changed: ', newPos, ' | was: ', oldPos)
        map.setCenter(newPos)
        map.setZoom(15)
        if (locationMarkerIsSet) {
          console.log("entering in marker is set")
          locationMarker.setMap(null);
          locationMarker = null;
        }
        locationMarkerIsSet = true;
        locationMarker = new google.maps.Marker({
          position: new google.maps.LatLng(this.coords),
          map: map,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          }
        })
      },
      deep: true
    }
  },
  methods: {
    switchTab(tab){
      this.$emit("switchTab", tab)
    },
    clearMarkers() {
      console.log("[CLEAN MARKERS]: number markers " + StationsMarkers.length)
      StationsMarkers.forEach(m => m.marker.map = null)
      StationsMarkers = []
    },
    buildMarkers() {
      // -----
      UserService.getState(this.currentUser._id).then(res=>{
        console.log(res.data)
        this.$store.dispatch("userState/refreshStatus",res.data)
      }).catch(err=>{
        console.log(err)
      })

      // -----
      const yellow_marker_icon = {
        url: yellow_marker_url, // url
        scaledSize: new google.maps.Size(40, 40), // scaled size
      };

      const green_marker_icon = {
        url: green_marker_url, // url
        scaledSize: new google.maps.Size(40, 40), // scaled size
      };


      StationService.getStations().then(
        (response) => {
          var stations = response.data
          stations.forEach(station => {

            console.log(station)

            // I have three different markers only because I would like to show the one which are
            // reserved and the once which are in charging

            // Here the correct way to do it would be revert back to the advancedMarkers and use a class
            let marker = {}

            if (station._id === this.userStationReserved) {
              station.status = "reserved"
              const pinViewBackground = new google.maps.marker.PinView({
                background: "#FBBC04",
                scale: 1.3,
                glyph: "",
              });

              //   label: "" + (station.totalTowers - station.usedTowers),

              marker = new google.maps.marker.AdvancedMarkerView({
                map,
                position: new google.maps.LatLng(station.latitude, station.longitude),
                content: pinViewBackground.element,
              });
            } else if(station._id === this.userStationCharging){
              station.status = "connected"
              const pinViewBackground = new google.maps.marker.PinView({
                background: "#00FF00",
                scale: 1.3,
                glyph: "",
              });
              marker = new google.maps.marker.AdvancedMarkerView({
                map,
                position: new google.maps.LatLng(station.latitude, station.longitude),
                content: pinViewBackground.element,
              });
            } else{
              station.status = "free"
              const pinViewBackground = new google.maps.marker.PinView({
                background: "#FF0000",
                glyph: "",
              });
              marker = new google.maps.marker.AdvancedMarkerView({
                map,
                position: new google.maps.LatLng(station.latitude, station.longitude),
                content: pinViewBackground.element,
              });
            }

            StationsMarkers.push({station: station, marker: marker})})

            StationsMarkers.forEach(m => m.marker.addListener("click", () => {
              this.showStationCard = true
              this.station = m.station
              UserService.getFavouriteStations(this.currentUser._id).then((response) => {
                let favStations = response.data
                this.station.favorite = favStations.indexOf(m.station._id) > -1
              })
            }))
          })
          //   THIS PART NEEDS TO BE CHECKED AND IMPLEMENTED
          //   POTENTIALLY I WOULD LIKE TO MOVE ALL THE POST PROCESSING OF THE PROMISE IN THE SERVICE FILES
    .catch(error => {
        console.log(error)
        // if (error.response.status === 401) {
        //   console.log("trying to push")
        //   this.$router.push('/login')
        // }
      })
    }
  },
  emits: ['switchTab']
}
</script>

<style>
#mapDiv {
  width: 100%;
  height: 80vh;
}
</style>

