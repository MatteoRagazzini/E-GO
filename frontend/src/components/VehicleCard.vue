<template>
  <v-card
    class="mx-auto"
    width="100%"
    :prepend-icon= vehicle.logo
    variant="tonal"
  >

    <template v-slot:title>
      {{vehicle.description}}
    </template>

    <v-card-actions>
        <v-btn
        color="green"
        variant="outlined"
        @click="useVehicle">
          Use
        </v-btn>
      <v-btn
        color="red"
        variant="outlined"
        @click="deleteVehicle">
        Delete
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
export default {
  name: "VehicleCard",
  props:{
    vehicle:{
      id: String,
      description: String,
    }
  },
  methods: {
    useVehicle(vehicleID){

    },
    deleteVehicle(vehicleID){

    },
  }
}
</script>

<style scoped>

</style>
