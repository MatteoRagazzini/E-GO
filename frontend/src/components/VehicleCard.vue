<template>
  <v-card
    class="mx-auto"
    width="100%"
    :prepend-icon= vehicle.img
    variant="tonal"
    :title="vehicle.name"
  >

    <v-card-actions>

      <v-chip
        class="ma-2"
        color="green"
        text-color="white"
        label
        v-if="vehicle.isCurrent"
      >
        <v-icon start icon="mdi-check-decagram"></v-icon>
        In use
      </v-chip>

<!--      tbd decision if this is needed-->
<!--      <v-chip-->
<!--        class="ma-2"-->
<!--        color="green"-->
<!--        text-color="white"-->
<!--        label-->
<!--        v-if="vehicle.isCharging"-->
<!--      >-->
<!--        <v-icon start icon="mdi-lightning-bolt"></v-icon>-->
<!--        Charging-->
<!--      </v-chip>-->

      <v-spacer></v-spacer>
        <v-btn
        color="green"
        variant="outlined"
        v-if="!vehicle.isCurrent"
        @click="useVehicle(vehicle)">
          Use
        </v-btn>

      <v-btn
        color="red"
        variant="outlined"
        @click="deleteVehicle(vehicle._id)">
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "VehicleCard",
  data(){
    return {
      displayError: false,
    }
  },
  props:{
    vehicle: Object
  },
  methods: {
    useVehicle(vehicle){
      this.$emit("useVehicle", vehicle)
    },
    deleteVehicle(vehicleID){
        this.$emit("removeVehicle", vehicleID)
    },
  },
}
</script>

<style scoped>

</style>
