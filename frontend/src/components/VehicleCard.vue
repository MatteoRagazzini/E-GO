<template>
  <v-card
    class="mx-auto"
    width="100%"
    :prepend-icon= vehicle.icon
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
        @click="useVehicle(vehicle.id)">
          Use
        </v-btn>

      <v-btn
        color="red"
        variant="outlined"
        @click="deleteVehicle(vehicle.id)">
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
<!--  <v-alert type="error" v-if="displayError">Vehicle cannot be deleted</v-alert>-->
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
    useVehicle(vehicleID){
      this.$emit("useVehicle", vehicleID)
    },
    deleteVehicle(vehicleID){
        this.$emit("removeVehicle", vehicleID)
    },
  },
}
</script>

<style scoped>

</style>
