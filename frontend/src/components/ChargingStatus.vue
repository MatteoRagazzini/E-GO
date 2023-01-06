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
              color="teal"
            >
              <v-icon size="x-large">mdi-battery</v-icon>
              {{ value }}
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
        <v-card
          height="690">
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
        </v-card>
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
  sockets: {
    battery: function (data) {
      this.value = data
    },
    chargeCompleted:function(){
      this.snackbarColor = "green"
      this.snackbarText = "Charge completed"
      this.showSnackbar = true
    }
  },
  mounted() {
    this.loadChargeHistory()
  },

  methods: {
    loadChargeHistory() {
      ChargeService.getChargeHistory(this.currentUser._id).then(response=>{
        console.log("here")
        this.charges = response
      }).catch(err=>console.log(err))
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
  .v-card {
    display: flex !important;
    flex-direction: column;
  }
</style>
