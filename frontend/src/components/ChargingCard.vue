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
      <span class="font-weight-bold">Start time:</span> {{ formatDate(this.charge.startDateTime) }}
      <br>
      <span class="font-weight-bold">End time:</span> {{ formatDate(this.charge.stopDateTime) }}
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
  mounted() {
    console.log(this.charge)
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
  },
  methods: {
    formatDate(date) {
      let formattedDate = ""
      if (date) {
        let time = date.substring(11, 19)
        let day = date.substring(8, 10)
        let month = date.substring(5, 7)
        let year = date.substring(0, 4)
        formattedDate = day + "." + month + "." + year + ", " + time
      }
      return formattedDate
    }
  }
}
</script>

<style scoped>

</style>
