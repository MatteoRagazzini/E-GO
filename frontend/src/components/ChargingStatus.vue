
<template>
  <v-tabs
      bg-color="transparent"
      grow
      v-model="tab"
      color="green"
      centered
    >
    <v-tab value="CurrentCharging">
        Current charge
    </v-tab>
    <v-tab value="ChargingHistory">
        Charging history
    </v-tab>
  </v-tabs>
  <v-window justify="center" v-model="tab">
    <v-window-item value="CurrentCharging">
      <v-container v-if="isCharging" fluid class="fill-height">
          <v-row align="center" justify="center">
            <v-progress-circular
              :rotate="360"
              :size="400"
              :width="30"
              :model-value="value"
              color="green"
            >
             <span class="text-h5"> {{ value }}%</span>
            </v-progress-circular>
          </v-row>
           <v-row align="center" justify="center" class="text-h6">
              {{this.chargingText}}
            </v-row>
          <v-row align="center" justify="center" class="py-8">
            <v-btn @click="endCharge">Stop charging</v-btn>
          </v-row>
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
      <v-container v-else>
        <div align="center">
          <h2 class="py-10">Looks like you are not charging a vehicle</h2>
          <v-img
            max-height="600"
            max-width="600"
            :src=this.url
          ></v-img>
        </div>
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
import imgUrl from "@/assets/Charging_status.jpg";


export default {
  name: "ChargingStatus",
  components: {ChargingCard},
  data () {
    return {
      interval: {},
      value: 0,
      tab: "CurrentCharging",
      charges: [],
      snackbarText: "",
      snackbarColor: "green",
      showSnackbar: false,
      currentCharge: {},
      chargingText: "Your vehicle is charging...",
      url: imgUrl,
    }
  },

  computed: {
    currentUser() {
      this.user = this.$store.state.auth.user;
      return this.user
    },
    isCharging() {
      if(this.$store.state.userState.status === "connected") this.tab = "CurrentCharging";
      return this.$store.state.userState.status === "connected";
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
      this.chargingText = "Your vehicle is fully charged"
    }
  },
  mounted() {
    console.log(this.isCharging)
    this.loadChargeHistory()
  },
  methods: {
    loadChargeHistory() {
      ChargeService.getChargeHistory(this.currentUser._id).then(response=>{
        this.currentCharge = response.find(c=>!c.isCompleted)
        console.log(this.currentCharge)
        this.charges = response.reverse()
      }).catch(err=>console.log(err))
    },
    endCharge(){
      ChargeService.endCharge(this.currentUser).then(response=>{
        console.log(response)
        this.$store.dispatch("userState/goToFreeStatus")
        this.$socket.emit('endCharge')
        this.loadChargeHistory()
        this.value = 0
        this.switchTab("Map")
        //this.tab = "ChargingHistory"
      }).catch(err=>{
        console.log(err)
        this.snackbarColor = "red"
        this.snackbarText =  err
        this.showSnackbar = true
      })
      console.log("end charge")
    },
    switchTab(tab) {
      this.$emit("switchTab", tab)
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
    max-height: 70vh;
    overflow-y: scroll;

  }
</style>
