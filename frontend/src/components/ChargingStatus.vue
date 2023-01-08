<template>
  <v-tabs
    fixed-tabs
    bg-color="transparent"
    grow
    v-model="tab"
    color="green"
  >
    <v-tab value="CurrentCharging">
      Current charge
    </v-tab>
    <v-tab value="ChargingHistory">
      Charging history
    </v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item value="CurrentCharging"
    >
  <br>
  <v-container>
    <v-row align="center" justify="center">
    <v-progress-circular
      :rotate="360"
      :size="400"
      :width="30"
      :model-value="value"
      color="green"
    >
      <v-icon size="x-large">mdi-battery</v-icon>
      {{ value }}%
    </v-progress-circular>
    </v-row>
    <br>
    <transition name="blink">
    <v-row
      align="center" justify="center" class="text-h5">
      {{chargingText}}
    </v-row>
    </transition>
    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      absolute
      location="bottom right"
      :color="snackbarColor"
    >
      {{ this.snackbarText }}
    </v-snackbar>
<!--    <v-alert type="success" dismissible v-model="showAlert">Successfully charged!</v-alert>-->
  </v-container>
    </v-window-item>
    <v-window-item value="ChargingHistory"
    >
      <v-container id="scrollDiv">
        <v-list
        >
          <v-list-item
            v-for="charge in this.charges"
            :key="charge._id"
            :items="charges"
          >
            <ChargingCard
              :charge="charge"
            ></ChargingCard>
          </v-list-item>
        </v-list>
      </v-container>
    </v-window-item>
  </v-window>
</template>

<script>

import ChargingCard from "@/components/ChargingCard";
import ChargeService from "@/services/charge.service";

export default {
  name: "ChargingStatus",
  components: {ChargingCard},
  data () {
    return {
      interval: {},
      value: 0,
      chargingText: "Your device is charging...",
      tab: "CurrentCharging",
      charges: [],
      snackbarText: "",
      snackbarColor: "green",
      showSnackbar: false,
    }
  },

  computed: {
    currentUser() {
      this.user = this.$store.state.auth.user;
      return this.user
    }
  },

  mounted() {
    //tbd
    this.loadChargeHistory()
    this.interval = setInterval(() => {
      if (this.value === 100) {
        clearTimeout(this.interval)
        this.showSnackbar = true
        this.snackbarText = "Your device is fully charged!"
        this.snackbarColor = "green"
        return (this.value = 100)
      }
      this.value += 1
    }, 600)
  },

  methods: {
    loadChargeHistory() {
      ChargeService.getChargeHistory(this.currentUser._id).then(response=>{
        console.log("here")
        this.charges = response
      }).catch(err=>console.log(err))
      // ChargeService.startCharge(this.currentUser._id, this.station.id, this.tower.id).then(res => {
      //   console.log(res)
      // })
      //tbd load charges from backend
      //   const charge = {
      //     user_id: this.currentUser.user_id,
      //     station_id: "639f3e9c29a8a26bac492c5f",
      //     tower_id: 5,
      //     vehicle_id: 3,
      //     isCompleted: true,
      //     startDateTime: "06.01.2023 11:11:11",
      //     stopDateTime: "06.01.2023 11:21:21",
      //     duration: "10 min 10 sec",
      //     totalBatteryCharged: 100,
      //     cost: 5
      //   }
      //
      //   this.charges.push(charge)
      // }
    },


    beforeUnmount() {
      clearInterval(this.interval)
    },
  }
}
</script>

<style scoped>
  .v-progress-circular {
    margin: 1rem;
  }
  #scrollDiv {
    width: 100%;
    height: 70vh;
    overflow-y: scroll;
  }
</style>
