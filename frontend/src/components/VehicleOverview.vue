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
            @click="addVehicle">
            Add
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
</template>

<script>
import VehicleCard from "@/components/VehicleCard";
export default {
  name: "VehicleOverview",
  components: {VehicleCard},
  methods:{
      addVehicle(){

      },
  },
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
    }
  }
}
</script>

<style scoped>

</style>
