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
        <v-card-title>{{ this.station.title }}
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
        <v-card-subtitle class="my-4 text-subtitle-1">{{ this.station.address }}</v-card-subtitle>

        <v-card-text>
          <div v-if="!reserved">Availability: {{ this.stationAvailability }}</div>
          <div class="text-center" v-if="reserved">
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
          <!--      IF RESERVED-->
          <div v-if="reserved">{{ this.timerText }}</div>
          <v-spacer v-if="reserved"></v-spacer>
          <v-btn
            color="red"
            v-if="reserved"
            @click="releaseTower"
          >
            Cancel
          </v-btn>
          <!--      IF NOT RESERVED-->
          <v-btn v-if="!reserved"
            color="green"
            variant="text"
            @click="occupyTower('connect')"
            :disabled="connected"
          >
            Connect
          </v-btn>
          <v-btn v-if="!reserved"
            color="green"
            variant="text"
            @click="occupyTower('reserve')"
            :disabled="connected"
          >Reserve
          </v-btn>
          <v-spacer v-if="!reserved"></v-spacer>
          <v-btn color="primary" @click="closeStationCard" v-if="!reserved">Close</v-btn>
        </v-card-actions>
        <!-- IF RESERVED-->
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

<script>
import userService from "@/services/user.service";
import StationService from "@/services/station.service";
import ChargeService from "@/services/charge.service";

export default {
  data: () => ({
    loading: false,
    heartColor: "white",
   reserved: false,
    connected: false,
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
      this.reserved = false;
    }
  },
  computed: {
    colour() {
      if (this.reserved) return "red"
      else return "green"
    },
    currentUser() {
      this.user = this.$store.state.auth.user;
      return this.user
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
          StationService.occupyTower(this.currentUser['id'], this.station.id).then(
            (tower) => {
              this.tower = tower
              this.loading = false
              this.reserved = true
              console.log("[STATION]: reserved " + tower)
              this.$socket.emit('startTimer', {station: this.station.id, tower: tower.id, reason: option})
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
      StationService.releaseTower(this.station.id, this.tower.id).then( res => {
        console.log(res)
      this.$socket.emit('cancelTimer', {station: this.station.id, tower: this.tower.id})
      this.resetTimer()
      this.snackbarColor = "green"
      this.snackbarText = "Station successfully unbooked"
      this.showSnackbar = true
    }).catch(err=> console.log(err))
    },
  changeFavorite() {
    if (!this.station.favorite) {
      this.station.favorite = true
      userService.addFavouriteStation(this.currentUser['id'], this.station.id)
    } else {
      this.station.favorite = false
      userService.removeFavouriteStation(this.currentUser['id'], this.station.id)
    }
    // inform user
  },
    startCharge(){
      ChargeService.startCharge(this.currentUser['id'], this.station.id, this.tower.id)
        .then(res=>{
          console.log(res)
          this.snackbarColor = "green"
          this.snackbarText = "Charge Started"
          this.showSnackbar = true
        })
        .catch(err=>console.log(err))
    }
}
,
props: {
  showStationCard: Boolean,
  station: {
  id: String,
    //ratings: Number,
    title: String,
    //reviews: Number,
    address: String,
    usedTowers: Number,
    totalTowers: Number,
    favorite: Boolean,
  }
}
}
</script>

<style>

</style>

