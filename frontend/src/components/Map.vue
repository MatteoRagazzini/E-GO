<template>
  <v-btn
    id="showFavourite"
    icon
    :color="this.showOnlyFavourites == true ? 'pink' : 'grey'"
    @click="setShowOnlyFavourites"
  >
    <v-icon>mdi-heart</v-icon>
  </v-btn>

  <div id="mapDiv">
  </div>

  <StationCard
    v-model="this.showStationCard"
    @close="this.showStationCard = false"
    @switchTab="switchTab"
    :station="this.station"/>
  <v-snackbar
    v-model="showSnackbar"
    :timeout="2000"
    absolute
    :color="this.snackbarColor"
    location="bottom left"
  >
    {{ this.snackbarText }}
  </v-snackbar>
</template>


<script>
import UserService from "@/services/user.service";
import StationService from "@/services/station.service";
import StationCard from "@/components/StationCard.vue";
import ChargeService from "@/services/charge.service";

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
      favStations: [],
      showOnlyFavourites: false,
      showSnackbar: false,
      snackbarColor: "green",
      snackbarText: "",
    }
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
      this.$socket.emit('user', this.currentUser)
    },
    ChangeMarker: function (data) {
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
    this.showOnlyFavourites = this.currentUser.showOnlyFavourites
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
        this.setMapCenter(newPos)
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
    setShowOnlyFavourites() {
      this.showOnlyFavourites = !this.showOnlyFavourites

      UserService.setShowOnlyFavourites(this.currentUser._id, this.showOnlyFavourites).then(res => {
        let updatedUser = this.currentUser
        updatedUser.showOnlyFavourites = this.showOnlyFavourites
        this.$store.dispatch("auth/setShowOnlyFavourites", updatedUser)
        this.showOnlyFavourites ?
          this.snackbarText = "Your are now only displaying your favourite stations" :
          this.snackbarText = "Your are displaying all stations"
        this.snackbarColor = "green"
      })
        .catch(err => {
          console.log(err)
          this.snackbarText = err.response.data.message
          this.snackbarColor = "red"
        })

      this.showSnackbar = true

      this.clearMarkers()
      this.buildMarkers()
    },
    switchTab(tab) {
      this.$emit("switchTab", tab)
    },
    setMapCenter(newPos) {
      map.setCenter(newPos)
      map.setZoom(15)
    },
    refreshUserState() {
      UserService.getState(this.currentUser._id).then(res => {
        const user =  res.data
        let newState = {status:user.status , station:user.occupiedStationId}
        this.$store.dispatch("userState/refreshStatus", newState)
      }).catch(err => {
        console.log(err)
      })
    },
    getStationStatus(station_id) {
      return this.userStatus.station === station_id ? this.userStatus.status : "free"
    },
    clearMarkers() {
      StationsMarkers.forEach(m => {
        if (m.marker !== null) {
          m.marker.map = null
        }
      })
      StationsMarkers = []
    },
    buildMarkers() {
      UserService.getFavouriteStations(this.currentUser._id).then((response) => {
        this.favStations = response.data
      }).catch(err => console.log(err.response.data.message))

      StationService.getStations().then(
        (stations) => {
          stations.data.forEach(station => {
            let marker = null

            const content = document.createElement("div");
            content.classList.add("free")
            content.innerText = "" + (station.totalTowers - station.usedTowers)
            content.classList.add(this.getStationStatus(station._id))

            station.status = this.getStationStatus(station._id)
            station.favourite = this.favStations.indexOf(station._id) > -1
            if (this.showOnlyFavourites) {
              if (station.favourite) {

                marker = new google.maps.marker.AdvancedMarkerView({
                  map,
                  position: new google.maps.LatLng(station.latitude, station.longitude),
                  content: content,
                });
              }
            } else {
              marker = new google.maps.marker.AdvancedMarkerView({
                map,
                position: new google.maps.LatLng(station.latitude, station.longitude),
                content: content,
              });
            }

            StationsMarkers.push({station: station, marker: marker})
          })

          StationsMarkers.forEach(m => {
            if (m.marker !== null) {
              m.marker.addListener("click", () => {
                this.showStationCard = true
                this.station = m.station
              })
            }
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
  },
  emits: ['switchTab']
}
</script>

<style>
#mapDiv {
  width: 100%;
  height: 85vh;
  position: relative;
}

.free {
  align-items: center;
  background-color: #f63232;
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
  background-color: #ff9445;
}

.connected {
  background-color: #74c000;
}

#showFavourite {
  z-index: 10;
  position: absolute;
  top: 75vh;
  left: 1vh;
}

</style>

