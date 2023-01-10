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
        <v-card-text>
          <div><span class="font-weight-bold">Availability:</span> {{ this.stationAvailability }}</div>
          <br>
          <v-chip
            class="ma-2"
            color="green"
            text-color="white"
            v-if="this.station.status==='connected'"
          >
            <v-icon start icon="mdi-lightning-bolt"></v-icon>
            In charging
          </v-chip>
          <div class="text-center" v-if="this.station.status==='reserved'">
            <div>Click to unlock Tower {{ this.reservation.tower_id }}</div>
            <div class="py-6">
             <v-btn
                  color="success"
                  icon="mdi-lock-open-variant"
                  @click="startCharge"
                  size="x-large"
                ></v-btn>
            </div>
            <v-progress-linear
              :model-value="this.timerValue"
              color="green"
              height="25"
            >
              {{this.timerText}}
            </v-progress-linear>
          </div>
          <br>

        </v-card-text>
        <v-card-actions>
            <!--      IF RESERVED-->
            <v-spacer v-if="this.station.status==='reserved'"></v-spacer>
            <v-btn
              color="red"
              v-if="this.station.status==='reserved'"
              @click="releaseTower"
            >
              Cancel
            </v-btn>
            <!--      IF NOT RESERVED-->
            <v-btn v-if="this.station.status==='free'"
                   color="green"
                   variant="text"
                   :disabled="this.disabled"
                   @click="occupyTower('connect')"
            >
              Connect
            </v-btn>
            <v-btn v-if="this.station.status==='free'"
                   color="green"
                   variant="text"
                   :disabled="this.disabled"
                   @click="occupyTower('reserve')"
            >Reserve
            </v-btn>
            <v-spacer v-if="this.station.status==='free'"></v-spacer>

            <v-btn color="primary" v-if="this.station.status==='connected'" @click="endCharge">Disconnect</v-btn>

          <v-btn color="primary" @click="closeStationCard">Close</v-btn>
        </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="showSnackbar"
      :timeout="2000"
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
// this.this.station.status = this.station.status coming form the prop
// this.station.status can be free reserved or connected.
// has user reserved
// if one of these != null
// you print the station with station_id === that in a different colour



<script>
import userService from "@/services/user.service";
import StationService from "@/services/station.service";
import ChargeService from "@/services/charge.service";
import ReservationService from "@/services/reservation.service";

export default {
  data: () => ({
    loading: false,
    heartColor: "white",
    // this.station.status: "free",
    timerText: "",
    timerValue: 100,
    firstValue: 0,
    alertText: "",
    alertType: "success",
    showAlert: false,
    showSnackbar: false,
    snackbarText: "",
    snackbarColor: "",
    reservation: {},
    show: false,
  }),
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    timer: function (data) {

      if(this.firstValue === 0)this.firstValue = data

      if(data <= 60){
        this.timerText = "Reserved for " + data + "sec"
      }else{
        let minutes = Math.round(data/60)
        let seconds = Math.abs(data-minutes*60)
        this.timerText = "Reserved for " + minutes + "min " + seconds + "sec"
      }

      this.timerValue = 100/this.firstValue*data
      // this.timerValue = 50
    },
    expired: function (data) {
      console.log('Expired')
      this.resetTimer()
      this.station.status = "free"
      this.$store.dispatch("userState/goToFreeStatus")
    },
    endCharge: function (){
      console.log('Expired')
      this.resetTimer()
      this.station.status = "free"
      this.$store.dispatch("userState/goToFreeStatus")
    }
  },
  computed: {
    currentUser() {
      this.user = this.$store.state.auth.user;
      return this.user
    },
    disabled(){
      // this is representing if the user has already interacted with a station. In this case all the others are disabled
      // return this.$store.state.userState.status.isCharging;
      return this.$store.state.userState.status === "reserved" || this.$store.state.userState.status === "connected";
    },
    stationAvailability() {
      return (this.station.totalTowers - this.station.usedTowers) + "/" + this.station.totalTowers
    }
  },
  methods: {
    resetTimer() {
      this.firstValue = 0;
      this.timerValue = 100;
      this.timerText = "";
    },
    closeStationCard() {
      this.showSnackbar = false;
      this.$emit('close');
    },
    occupyTower(option) {
      this.loading = true
      console.log(this.currentUser._id)
      ReservationService.createReservation(this.currentUser, this.station).then(
        (reservation) => {
          console.log(reservation)
          this.reservation = reservation
          this.loading = false
          this.station.status = "reserved"
          this.$store.dispatch("userState/goToReservedStatus", this.station._id)
          console.log("[STATION]: reserved tower" + reservation.tower_id)
          this.$socket.emit('startTimer', {station: this.station._id, tower: reservation.tower_id, reason: option})
          this.snackbarColor = "green"
          this.snackbarText = "Station successfully reserved"
          this.showSnackbar = true
        })
        .catch(err => {
          console.log(err)
          this.snackbarColor = "red"
          this.snackbarText = err
          this.showSnackbar = true
          this.loading = false
        })
    },
    releaseTower() {
      this.loading = true
      ReservationService.deleteReservation(this.currentUser)
        .then(res => {
          console.log(res)
          this.$socket.emit('cancelTimer', {station: this.station._id, tower: this.reservation.tower_id})
          this.resetTimer()
          this.station.status = "free"
          this.$store.dispatch("userState/goToFreeStatus")
          this.snackbarColor = "green"
          this.snackbarText = "Station successfully unbooked"
          this.showSnackbar = true
          this.loading = false
        })
        .catch(err => console.log(err))
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
    startCharge() {
      ChargeService.startCharge(this.currentUser, this.station, this.reservation.tower_id)
        .then(res => {
          console.log(res)
          this.$socket.emit('startCharge')
          this.snackbarColor = "green"
          this.snackbarText = "Charge Started"
          this.showSnackbar = true
          this.station.status = "connected";
          // this updates the value in the store, so that if I go to the map it's changed real time
          this.$store.dispatch("userState/goToConnectedStatus", this.station._id)
          this.switchTab("Charging")
          this.closeStationCard();
        })
        .catch(err => console.log(err))
    },
    switchTab(tab) {
      this.$emit("switchTab", tab)
    },
    loadChargeHistory() {
      ChargeService.getChargeHistory(this.currentUser._id).then(response => {
        this.currentCharge = response.find(c => !c.isCompleted)
        console.log(this.currentCharge)
        this.charges = response.reverse()
      }).catch(err => console.log(err))
    },
    endCharge() {
      ChargeService.endCharge(this.currentUser).then(response => {
        console.log(response)
        this.$store.dispatch("userState/goToFreeStatus")
        this.$socket.emit('endCharge')
        this.loadChargeHistory()
        this.tab = "ChargingHistory"
      }).catch(err => {
        console.log(err)
        this.snackbarColor = "red"
        this.snackbarText = err
        this.showSnackbar = true
      })
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

