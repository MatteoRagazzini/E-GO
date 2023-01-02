<template>
  <v-tabs
    fixed-tabs
    bg-color="transparent"
    grow
    v-model="tab"
    color="green"
  >
    <v-tab value="vehicles">
      Vehicles
    </v-tab>
    <v-tab value="history">
      Charging history
    </v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item value="vehicles"
    >
      <v-card
        color="white"
        flat
      >
        <v-list
          lines = "two"
        >
          <v-list-subheader inset>Your vehicles</v-list-subheader>
          <v-list-item
              v-for="vehicle in this.vehicles"
              :key="vehicle.id"
              :items="vehicles"
            >
            <VehicleCard :vehicle="vehicle"></VehicleCard>
            </v-list-item>
        </v-list>
        <div class="d-flex justify-space-around">
          <v-btn
            color="green"
            @click="showDialog"
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
      </v-card>
    </v-window-item>
    <v-window-item value="history"
    >
      <v-card
        flat
      >
        <v-card-text>history</v-card-text>
      </v-card>
    </v-window-item>
  </v-window>
    <v-snackbar
      v-model="hasSaved"
      :timeout="3000"
      absolute
      location="bottom right"
    >
      Your vehicle has been added successfully
    </v-snackbar>
</template>

<script>
import VehicleCard from "@/components/VehicleCard";
import AddVehicleDialog from "@/components/AddVehicleDialog";
export default {
  name: "VehicleOverview",
  components: {AddVehicleDialog, VehicleCard},

  data() {
    return {
      tab: "VehicleOptions",
      vehicles: [
        {
          id: '1',
          description: "Scooter 1",
          logo: "mdi-scooter"
        },
        {
          id: '2',
          description: "Bike 1",
          logo: "mdi-bicycle"
        },
      ],
      dialog: false,
      hasSaved: false,
    }
  },
  methods: {
    showDialog(){
      this.dialog = true
    },

    closeDialog(newVehicle) {
      this.dialog = false
      this.vehicles.push(newVehicle)
      this.hasSaved = true
      console.log(this.vehicles)
    }
  }
}
</script>

<style scoped>

</style>
