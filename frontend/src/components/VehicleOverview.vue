<template>
  <!--  <p class="font-weight-bold text-h5">Your vehicles</p>-->
  <v-container id="scrollDiv">
    <v-progress-circular
      indeterminate
      color="green"
      v-if="loading"
    ></v-progress-circular>
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
  </v-container>
  <div class="d-flex justify-center align-baseline py-6">
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
  </div>
  <v-snackbar
    v-model="showSnackbar"
    :timeout="1800"
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
    loadVehicles() {
      UserService.getVehicles(this.currentUser._id).then(
        (response) => {
          this.vehicles = response.data
          this.vehicles.forEach(vehicle => {
            if (vehicle.isCurrent) {
              this.currentVehicle = vehicle._id
            }
          })
          this.loading = false
        })
        .catch(error => {
          err.response.data.message
          this.snackbarColor = "green"
          this.snackbarText = "Your new vehicle has been added successfully"
          this.showSnackbar = true
        })
    },

    showDialog() {
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
      if (this.currentVehicle !== vehicleID) {
        UserService.removeVehicle(this.currentUser._id, vehicleID)
          .then(res => {
            this.displaySnackbar("Your vehicle has been removed successfully", "green")
            const vehicleToRemoveIndex = this.vehicles.findIndex((obj) => obj._id === vehicleID);
            if (vehicleToRemoveIndex > -1) {
              this.vehicles.splice(vehicleToRemoveIndex, 1);
            } else {
              this.displaySnackbar("Error", "red")
            }
          })
          .catch(err => {
            this.displaySnackbar(err.response.data.message, "red")
          })
      } else {
        this.displaySnackbar("You can't remove a vehicle in use", "red")
      }
    },

    useVehicle(vehicle) {
      const vehicleToUseIndex = this.vehicles.findIndex(v => v._id === vehicle._id)

      this.vehicles.forEach(v => v.isCurrent = false)


      this.vehicles[vehicleToUseIndex].isCurrent = true
      this.currentVehicle = vehicle._id

      UserService.updateVehicle(this.currentUser._id, vehicle)
        .then(res => {
          this.displaySnackbar("Vehicle in use has been changed successfully", "green")
        })
        .catch(err => {
          this.displaySnackbar(err.response.data.message, "red")
        })
    },
    displaySnackbar(snackbarText, snackBarColor) {
      this.snackbarColor = snackBarColor
      this.snackbarText = snackbarText
      this.showSnackbar = true
    }
  }
}
</script>

<style scoped>
#scrollDiv {
  width: 100%;
  max-height: 70vh;
  overflow-y: scroll;
}
</style>
