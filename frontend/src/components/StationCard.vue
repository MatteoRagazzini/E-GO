<template>
  <v-dialog>
    <v-card
      :loading="loading"
      class="mx-auto my-12"
      max-width="374"
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

        <div>Availability: {{ this.stationAvailability }}</div>

      </v-card-text>
      <v-card-text v-if="reserved">

        <div>{{ this.timerText }}</div>

      </v-card-text>

      <v-card-actions>
        <v-btn
          color="green"
          variant="text"
          @click="occupyStation('connect')"
          :disabled="connected"
        >
          {{ status }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :color="colour"
          variant="text"
          @click="occupyStation('reserve')"
          :disabled="connected"
        >
          {{ this.bookingStatus }}
        </v-btn>
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

<script>
import userService from "@/services/user.service";
import StationService from "@/services/station.service";

export default {
  data: () => ({
    loading: false,
    heartColor: "white",
    reserved: false,
    connected: false,
    status: "connect",
    bookingStatus: "Reserve for 1 min",
    timerText: "",
    alertText: "",
    alertType: "success",
    showAlert: false,
    showSnackbar: false,
    snackbarText: "",
    snackbarColor: "",
    tower: {}
  }),
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    timer: function (data) {
      this.timerText = "Reserved for " + data + "sec"
    },
    expired: function (data) {
      console.log('Expired')
      this.bookingStatus = "Reserve for 1 min";
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
    closeStationCard() {
      this.$emit('close');
    },
    occupyStation(option) {
          this.loading = true
          StationService.bookStation(this.currentUser['id'], this.station.id).then(
            (tower) => {
              this.tower = tower
              this.loading = false
              this.reserved = true
              console.log("[STATION]: reserved " + tower)
              this.$socket.emit('reserveStation', {station: this.station.id, tower: tower.id, reason: option})
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
    releaseStation(){
      this.$socket.emit('cancel', {station: this.station.id, tower: this.tower.id})
      this.snackbarColor = "green"
      this.snackbarText = "Station successfully unbooked"
      this.showSnackbar = true
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

