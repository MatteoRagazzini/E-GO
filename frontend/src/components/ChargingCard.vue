<template>
  <v-card
    class="mx-auto"
    width="100%"
    variant="tonal"
  >
    <v-card-title>
      Charged: {{ this.charge.vehicle_name }}
      <v-chip
        class="ma-2"
        :color="this.completedLabel.color"
        text-color="white"
        label
      >
        {{ this.completedLabel.text }}
      </v-chip>
    </v-card-title>
    <v-card-text>
      <span class="font-weight-bold">StartTime:</span> {{ this.charge.startDateTime }}
      <br>
      <span class="font-weight-bold">EndTime:</span> {{ this.charge.stopDateTime }}
      <br>
      <span class="font-weight-bold">Duration:</span> {{ this.charge.duration }}
      <br>
      <span class="font-weight-bold">Station:</span> {{ this.charge.station_name }}
      <br>
      <span class="font-weight-bold">Tower:</span> Tower {{ this.charge.tower_id }}
      <br>
      <span class="font-weight-bold">Total battery charged:</span> {{ this.charge.totalBatteryCharged }} %
      <br>
      <span class="font-weight-bold">Cost:</span> {{ this.charge.cost }} €
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  name: "ChargingCard",
  data() {
    return {
      labelColor: "green",
      vehicleName: "test",
      stationName: "test",
    }
  },
  props: {
    charge: Object
  },
  computed: {
    currentUser() {
      this.user = this.$store.state.auth.user;
      return this.user
    },
    completedLabel() {
      return this.charge.isCompleted ?
        {
          text: "Completed",
          color: "green"
        } : {
          text: "Not Completed",
          color: "red"
        }
    }
  }
}
</script>

<style scoped>

</style>
