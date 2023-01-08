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
      station: {},
    }
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
      this.$socket.emit('user', this.currentUser)
    },
    ChangeMarker: function (data) {
      console.log("[MAP] receive ChangeMarker: ", data)
      this.clearMarkers()
      if (data === 'inc') this.station.usedTowers++
      else if (data === 'dec') this.station.usedTowers--
      this.buildMarkers()
    }
  },
  computed: {
    currentUser() {
      this.user = this.$store.state.auth.user;
      return this.user
    },
    userStatus() {
      return this.$store.state.userState
    }
  },
  mounted() {
    map = new google.maps.Map(document.getElementById("mapDiv"), {
      center: this.coords,
      zoom: 13,
      mapId: "16c023e99af33056",
    })
    this.refreshUserState();
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
          locationMarker.map = null
          locationMarker = null;
        }
        locationMarkerIsSet = true;

        const icon = document.createElement("div");
        icon.innerHTML = '<i class="fa-solid fa-user"></i>';

        const faPinView = new google.maps.marker.PinView({
          glyph: icon,
          glyphColor: "#000000",
          background: "#03c6fc",
          borderColor: "#0335fc",
        });

        locationMarker = new google.maps.marker.AdvancedMarkerView({
          position: new google.maps.LatLng(this.coords),
          map: map,
          content: faPinView.element
        })
      },
      deep: true
    }
  },
  methods: {
    switchTab(tab) {
      this.$emit("switchTab", tab)
    },
    refreshUserState(){
      UserService.getState(this.currentUser._id).then(res => {
        console.log(res.data)
        this.$store.dispatch("userState/refreshStatus", res.data)
      }).catch(err => {
        console.log(err)
      })
    },
    getStationStatus(station_id) {
      return this.userStatus.station === station_id ? this.userStatus.status : "free"
    },
    clearMarkers() {
      console.log("[CLEAN MARKERS]: number markers " + StationsMarkers.length)
      StationsMarkers.forEach(m => m.marker.map = null)
      StationsMarkers = []
    },
    buildMarkers() {
      StationService.getStations().then(
        (stations) => {
            stations.data.forEach(station => {
            let marker = {}

            const content = document.createElement("div");
              content.classList.add("free")
            content.innerText = "" + (station.totalTowers - station.usedTowers)
            content.classList.add(this.getStationStatus(station._id))

            station.status = this.getStationStatus(station._id)


            marker = new google.maps.marker.AdvancedMarkerView({
              map,
              position: new google.maps.LatLng(station.latitude, station.longitude),
              content: content,
            });

            StationsMarkers.push({station: station, marker: marker})
          })

          StationsMarkers.forEach(m => m.marker.addListener("click", () => {
            this.showStationCard = true
            this.station = m.station
            UserService.getFavouriteStations(this.currentUser._id).then((response) => {
              let favStations = response.data
              this.station.favorite = favStations.indexOf(m.station._id) > -1
            })
          }))
        })
        .catch(error => {
          console.log(error)
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

.free {
  align-items: center;
  background-color: #FF0000;
  border-radius: 50%;
  border: #263238 solid 2px;
  color: #263238;
  display: flex;
  font-size: 14px;
  gap: 15px;
  height: 32px;
  justify-content: center;
  padding: 4px;
  position: relative;
  transition: all 0.3s ease-out;
  width: 32px;
}

.free::after {
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 7px solid #263238;
  content: "";
  height: 0;
  left: 50%;
  position: absolute;
  top: 95%;
  transform: translate(-50%, 0);
  transition: all 0.3s ease-out;
  width: 0;
  z-index: 1;
}

.reserved {
  background-color: #ffa500;
}

.connected {
  background-color: #00FF00;
}

</style>

