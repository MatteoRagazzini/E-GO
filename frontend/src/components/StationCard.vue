<template>
  <v-dialog>
<!--    <v-card>-->
<!--      <v-card-text>-->
<!--        id: {{id}}-->
<!--      </v-card-text>-->
<!--    </v-card>-->
    <v-card
      :loading="loading"
      class="mx-auto my-12"
      max-width="374"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="deep-purple"
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-card-item>
        <v-card-title>{{ this.station.title }}</v-card-title>
      </v-card-item>

      <v-card-text>
        <v-row
          align="center"
          class="mx-0"
        >
          <v-rating
            :model-value="this.station.ratings"
            color="amber"
            density="compact"
            half-increments
            readonly
            size="small"
          ></v-rating>

          <div class="text-grey ms-4">
            {{this.station.ratings}} {{this.station.reviews}}
          </div>
        </v-row>

        <div class="my-4 text-subtitle-1">
          $ • Italian, Cafe
        </div>

        <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div>
      </v-card-text>

      <v-divider class="mx-4 mb-1"></v-divider>

      <v-card-title>Tonight's availability</v-card-title>

      <div class="px-4">
        <v-chip-group v-model="selection">
          <v-chip>5:30PM</v-chip>

          <v-chip>7:30PM</v-chip>

          <v-chip>8:00PM</v-chip>

          <v-chip>9:00PM</v-chip>
        </v-chip-group>
      </div>

      <v-card-actions>
        <v-btn
          color="deep-purple-lighten-2"
          variant="text"
          @click="reserve"
        >
          Reserve
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    selection: 1,
  }),

  methods: {
    reserve () {
      this.loading = true

      setTimeout(() => (this.loading = false), 2000)
    },
  },
  props:{
    station:{
      id: String,
      ratings: Number,
      title:String,
      reviews: Number
    }
  }
}
</script>

<style>
</style>

