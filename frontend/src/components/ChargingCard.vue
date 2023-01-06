<template>
  <v-card
    class="mx-auto"
    width="100%"
    variant="tonal"
  >
    <v-card-title>
      Charged: {{this.vehicleName}}
      <v-chip
        class="ma-2"
        :color="this.labelColor"
        text-color="white"
        label
      >
        {{ this.isCompletedLabel }}
      </v-chip>
    </v-card-title>
    <v-card-text>
      <div>
      <span class="font-weight-bold">Time:</span> {{this.charge.startDateTime}} - {{this.charge.stopDateTime}}
      </div>
      <span class="font-weight-bold">Duration:</span> {{this.charge.duration}}
      <br>
      <span class="font-weight-bold">Station:</span> {{this.stationName}}
      <br>
      <span class="font-weight-bold">Tower:</span> Tower {{this.charge.tower_id}}
      <br>
      <span class="font-weight-bold">Total battery charged:</span> {{this.charge.totalBatteryCharged}} %
      <br>
      <span class="font-weight-bold">Cost:</span> {{this.charge.cost}} €
    </v-card-text>
  </v-card>
</template>

<script>
import StationService from "@/services/station.service";
import UserService from "@/services/user.service";

export default {
  name: "ChargingCard",
  data(){
    return {
      isCompletedLabel: "Completed",
      labelColor: "green",
      vehicleName: "test",
      stationName: "test",
    }
  },
  props:{
    charge: Object
  },
  computed: {
    currentUser() {
      this.user = this.$store.state.auth.user;
      return this.user
    }
  },
  mounted(){

    StationService.getStation(this.charge.station_id).then(
      (response) => {
        this.stationName = response.data.address
      })
      .catch(error => {
        console.log(error)
        if (error.response.status === 401) {
          console.log("trying to push")
          this.$router.push('/login')
        }
      })

    UserService.getVehicle(this.currentUser.id, this.charge.vehicle_id).then(
      (response) => {
        this.vehicleName = response.data.name
      })
      .catch(error => {
        console.log(error)
        if (error.response.status === 401) {
          console.log("trying to push")
          this.$router.push('/login')
        }
      })

    if(this.charge.isCompleted === false){
      this.isCompleted = "Not completed"
      this.labelColor = "red"
    }
  },
}
</script>

<style scoped>

</style>
