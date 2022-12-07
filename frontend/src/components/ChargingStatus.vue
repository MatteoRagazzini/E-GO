<template>
  <br>
  <v-container>
    <v-row align="center" justify="center">
    <v-progress-circular
      :rotate="360"
      :size="400"
      :width="30"
      :model-value="value"
      color="teal"
    >
      <v-icon size="x-large">mdi-battery</v-icon>
      {{ value }}
    </v-progress-circular>
    </v-row>
    <br>
    <transition name="blink">
    <v-row
      align="center" justify="center" class="text-h5">
      {{chargingText}}
    </v-row>
    </transition>
    <v-alert type="success" dismissible v-model="showAlert">Successfully charged!</v-alert>
  </v-container>
</template>

<script>
export default {
  name: "ChargingStatus",
  data () {
    return {
      interval: {},
      value: 0,
      chargingText: "Your device is charging...",
      showAlert: false,
    }
  },
  beforeUnmount () {
    clearInterval(this.interval)
  },
  mounted () {
    this.interval = setInterval(() => {
      if (this.value === 100) {
        clearTimeout(this.interval)
        this.chargingText = "Your device is fully charged!"
        this.showAlert = true
        return (this.value = 100)
      }
      this.value += 1
    }, 600)
  },

}
</script>

<style scoped>
  .v-progress-circular {
    margin: 1rem;
  }
</style>
