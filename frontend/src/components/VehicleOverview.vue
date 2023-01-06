<template>
  <v-progress-circular
    indeterminate
    color="green"
    v-if="loading"
  ></v-progress-circular>
  <v-card
    id="scrollable"
    height="690"
    color="white">
    <v-card-title
      color="black">
      Your vehicles
    </v-card-title>
    <v-list
    >
      <v-list-item
          v-for="vehicle in this.vehicles"
          :key="vehicle._id"
          :items="vehicles"
      >
        <VehicleCard
          :vehicle="vehicle"
          @useVehicle="useVehicle"
          @removeVehicle="removeVehicle"></VehicleCard>
        </v-list-item>
    </v-list>
    <v-card-actions>
      <v-spacer></v-spacer>
        <v-btn
          color="green"
          @click="showDialog"
          variant="tonal"
        >
          Add

          <v-dialog
            v-model="dialog">
            <AddVehicleDialog
              @save="closeDialog"
            ></AddVehicleDialog>
          </v-dialog>
        </v-btn>
      <v-spacer></v-spacer>
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
</template>

<script>
import VehicleCard from "@/components/VehicleCard";
import AddVehicleDialog from "@/components/AddVehicleDialog";
import UserService from "@/services/user.service";
export default {
  name: "VehicleOverview",
  components: {AddVehicleDialog, VehicleCard},

  data() {
    return {
      vehicles: null,
      currentVehicle: null,
      dialog: false,
      showSnackbar: false,
      snackbarText: "",
      snackbarColor: "",
      loading: true
    }
  },
  computed: {
    currentUser() {
      this.user = this.$store.state.auth.user;
      return this.user
    }
  },
  mounted() {
    this.loadVehicles()
  },

  methods: {
    loadVehicles(){
      UserService.getVehicles(this.currentUser._id).then(
        (response) => {
          this.vehicles = response.data
          this.vehicles.forEach(vehicle =>{
            if (vehicle.isCurrent) {
              this.currentVehicle = vehicle._id
            }
          })
          this.loading=false
        })
        .catch(error => {
          console.log(error)
          if (error.response.status === 401) {
            console.log("trying to push")
            this.$router.push('/login')
          }
        })
    },

    showDialog(){
      this.dialog = true
    },

    closeDialog(newVehicle) {
      this.dialog = false
      UserService.addVehicle(this.currentUser._id, newVehicle).then(this.loadVehicles)
      // this.loadVehicles()
      this.snackbarColor = "green"
      this.snackbarText = "Your new vehicle has been added successfully"
      this.showSnackbar = true
    },

    removeVehicle(vehicleID) {
      if (this.currentVehicle !== vehicleID){

        UserService.removeVehicle(this.currentUser._id, vehicleID)

        const vehicleToRemoveID = this.vehicles.findIndex((obj) => obj._id === vehicleID);

         if (vehicleToRemoveID > -1) {
           this.vehicles.splice(vehicleToRemoveID, 1);
         }
        this.snackbarColor = "green"
        this.snackbarText = "Your vehicle has been removed successfully"

      }else{
        this.snackbarColor = "red"
        this.snackbarText = "This vehicle cannot be removed"
      }
      this.showSnackbar = true
    },

    useVehicle(vehicle) {
      if (this.currentVehicle !== vehicle._id){

        const vehicleToUseIndex = this.vehicles.findIndex((obj) => obj._id === vehicle._id)
        const vehicleToUse = this.vehicles.find((obj) => obj._id === vehicle._id)

        if (this.currentVehicle != null) {
          const vehicleToUseIndexOld = this.vehicles.findIndex((obj) => obj._id === this.currentVehicle)
          this.vehicles[vehicleToUseIndexOld].isCurrent = false
        }

        this.vehicles[vehicleToUseIndex].isCurrent = true
        this.currentVehicle = vehicle._id

        UserService.updateVehicle(this.currentUser._id, vehicle)

        this.snackbarText = "Vehicle in use has been changed successfully"
      } else {
        this.snackbarText = "This vehicle is already in use"

      }

      this.snackbarColor = "green"
      this.showSnackbar = true
    }
  }
}
</script>

<style scoped>
.v-card {
  display: flex !important;
  flex-direction: column;
}
</style>
