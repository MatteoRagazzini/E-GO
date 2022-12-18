<template>
  <v-dialog>
    <v-card>
      <v-card-text>
        id: {{id}}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>

const stationProp = defineProps({
    id: String,
  })

</script>


<style>
</style>

