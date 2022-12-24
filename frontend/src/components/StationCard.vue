<template>
  <v-dialog>
    <v-card
      :loading="loading"
      class="mx-auto my-12"
      max-width="374"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="green"
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-card-item>
        <v-card-title>{{ this.station.title }}
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
      <v-card-subtitle class="my-4 text-subtitle-1">{{this.station.address}}</v-card-subtitle>

      <v-card-text>

        <div>Availability: {{this.station.availability }}</div>

      </v-card-text>

      <v-card-actions>
        <v-btn
          color="green"
          variant="text"
          @click="connect"
          :disabled="connected"
        >
          Connect
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="green"
          variant="text"
          @click="reserve"
          :disabled="reserved || connected"
        >
          Reserve for 30min
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import userService from "@/services/user.service";

export default {
  data: () => ({
    loading: false,
    heartColor: "white",
    reserved: false,
    connected: false,
    alertText: "",
    alertType: "success",
    showAlert: false,
  }),
  methods: {
    reserve () {
      this.loading = true
      setTimeout(() => (this.loading = false), 2000)
      this.reserved = true
      this.alertType = "success"
      this.alertText = "Reservation successfully"
      this.showAlert = true

      // create reservation
      // send reservation to backend
      // send user notification
      // set also info in stationCard
    },
    connect () {
      this.loading = true
      setTimeout(() => (this.loading = false), 2000)
      this.connected = true
      this.alertType = "success"
      this.alertText = "Vehicle successfully connected"
      this.showAlert = true


      // create charge
      // send charge to backend
      // send user notification
      // set also info in stationCard
    },
    changeFavorite () {
      if (!this.station.favorite) {
        this.station.favorite = true
        userService.addFavouriteStation()
      }else{
        this.station.favorite = false
      }
      // update favorite
      // send favorite to backend
      // inform user
    },
  },
  props:{
    station:{
      id: String,
      //ratings: Number,
      title:String,
      //reviews: Number,
      address: String,
      availability: String,
      favorite: Boolean,
    }
  }
}
</script>

<style>
</style>

