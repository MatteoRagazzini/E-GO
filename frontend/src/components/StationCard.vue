<template>
  <v-dialog>
    <v-card
      :loading="loading"
      class="mx-auto my-12"
      max-width="374"
      min-width="300"
    >
      <v-progress-linear
        :active="loading"
        color="green"
        height="4"
        indeterminate
      ></v-progress-linear>

      <v-card-item>
        <v-card-title>{{ this.station.address }}
          <!--       What is that icon for?-->
          <v-btn
            icon
            :color="this.station.favorite === true ? 'pink' : 'grey'"
            @click="changeFavorite"
            variant="plain"
          >
            <v-icon>mdi-heart</v-icon>
          </v-btn>
        </v-card-title>
      </v-card-item>

      <v-divider class="mx-4 mb-1"></v-divider>
        <v-card-subtitle class="my-4 text-subtitle-1">not existed</v-card-subtitle>

        <v-card-text>
          <div>Availability: {{ this.stationAvailability }}</div>
          <div v-if="status==='connected'">In charging</div>
          <div class="text-center" v-if="this.status==='reserved'">
            <div>Click to unlock Tower {{ this.tower.id }}</div>
            <br>
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="20"
              :model-value="this.timerValue"
              color="#C6F68D"
            >
            <v-btn
              color="success"
              icon="mdi-lightning-bolt"
              @click="startCharge"
              size="x-large"
            ></v-btn>
            </v-progress-circular>
          </div>
          <br>

        </v-card-text>
        <v-card-actions>
          <div v-if="!isCharging">
            <!--      IF RESERVED-->
            <div v-if="status==='reserved'">{{ this.timerText }}</div>
            <v-spacer v-if="status==='reserved'"></v-spacer>
            <v-btn
              color="red"
              v-if="status==='reserved'"
              @click="releaseTower"
            >
              Cancel
            </v-btn>
            <!--      IF NOT RESERVED-->
            <v-btn v-if="status==='free'"
                   color="green"
                   variant="text"
                   @click="occupyTower('connect')"
            >
              Connect
            </v-btn>
            <v-btn v-if="status==='free'"
                   color="green"
                   variant="text"
                   @click="occupyTower('reserve')"
            >Reserve
            </v-btn>
            <v-spacer v-if="status==='free'"></v-spacer>
            <v-btn color="primary" v-if="status==='connected'">Disconnect</v-btn>
          </div>
          <v-btn color="primary" @click="closeStationCard">Close</v-btn>
        </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      absolute
      location="bottom right"
      :color="snackbarColor"
    >
      {{ this.snackbarText }}
    </v-snackbar>
  </v-dialog>
</template>

// you pass a prop in case the user has reserved or is charging containing the station id.
// add a field to the station prop isReserved isCharging
// this.status = status coming form the prop
// status can be free reserved or connected.
// has user reserved
// if one of these != null
// you print the station with station_id === that in a different colour



<script>
import userService from "@/services/user.service";
import StationService from "@/services/station.service";
import ChargeService from "@/services/charge.service";

export default {
  data: () => ({
    loading: false,
    heartColor: "white",
    status: "free",
    timerText: "",
    timerValue: 100,
    firstValue: 0,
    alertText: "",
    alertType: "success",
    showAlert: false,
    showSnackbar: false,
    snackbarText: "",
    snackbarColor: "",
    tower: {},
  }),
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    timer: function (data) {

      if(this.firstValue === 0)this.firstValue = data

      this.timerText = "Reserved for " + data + "sec"
      this.timerValue = 100/this.firstValue*data
      // this.timerValue = 50
    },
    expired: function (data) {
      console.log('Expired')
      this.resetTimer()
      this.status = "free";
    },
    endCharge: function (){
      console.log('Expired')
      this.resetTimer()
      this.status = "free";
    }
  },
  computed: {
    currentUser() {
      this.user = this.$store.state.auth.user;
      return this.user
    },
    isCharging(){
      return this.$store.state.userState.status.isCharging;
    },
    stationAvailability() {
      return (this.station.totalTowers - this.station.usedTowers) + "/" + this.station.totalTowers
    }
  },
  methods: {
    resetTimer(){
      this.firstValue = 0;
      this.timerValue = 100;
      this.timerText = "";
    },
    closeStationCard() {
      this.$emit('close');
    },
    occupyTower(option) {
          this.loading = true
      console.log(this.currentUser._id)
          StationService.occupyTower(this.currentUser._id, this.station._id).then(
            (tower) => {
              this.tower = tower
              this.loading = false
              this.status = "reserved";
              console.log("[STATION]: reserved " + tower)
              this.$socket.emit('startTimer', {station: this.station._id, tower: tower.id, reason: option})
              this.snackbarColor = "green"
              this.snackbarText = "Station successfully reserved"
              this.showSnackbar = true
            }).catch(err => {
            console.log(err)
            this.snackbarColor = "red"
            this.snackbarText = "Station is full"
            this.showSnackbar = true
            this.loading = false
          })
    },
    releaseTower(){
      StationService.releaseTower(this.station._id, this.tower.id).then( res => {
        console.log(res)
      this.$socket.emit('cancelTimer', {station: this.station._id, tower: this.tower.id})
      this.resetTimer()
      this.snackbarColor = "green"
      this.snackbarText = "Station successfully unbooked"
      this.showSnackbar = true
    }).catch(err=> console.log(err))
    },
  changeFavorite() {
    if (!this.station.favorite) {
      this.station.favorite = true
      userService.addFavouriteStation(this.currentUser._id, this.station._id)
    } else {
      this.station.favorite = false
      userService.removeFavouriteStation(this.currentUser._id, this.station._id)
    }
    // inform user
  },
    startCharge(){
      ChargeService.startCharge(this.currentUser, this.station, this.tower.id)
        .then(res=>{
          console.log(res)
          this.$socket.emit('startCharge')
          this.snackbarColor = "green"
          this.snackbarText = "Charge Started"
          this.showSnackbar = true
          this.status = "connected";
          // this updates the value in the store, so that if I go to the map it's changed real time
          this.$store.dispatch("userState/startedCharging")
          this.switchTab("Charging")
          this.closeStationCard();
        })
        .catch(err=>console.log(err))
    },
    switchTab(tab){
      this.$emit("switchTab", tab)
    }
}
,
props: {
  showStationCard: Boolean,
  station: Object
},
  emits: ['switchTab','close']
}
</script>

<style>

</style>

