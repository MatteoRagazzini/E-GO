<template>
  <v-form v-model="this.valid">
    <div class="text-center">
      <v-card>
        <v-card-title>
          Add a new vehicle
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="this.vehicleTypeValue"
                :items="this.vehicleTypes"
                label="Vehicle type"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
            <v-text-field
              v-model="vehicleDescription"
              :rules="descriptionRules"
              color="white"
              label="Description"
              required
            ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :disabled="!this.valid"
            @click="save"
            color="success"
          >
            Save
          </v-btn>
        </v-card-actions>

      </v-card>
    </div>
  </v-form>
</template>

<script>
export default {
  name: "AddVehicleDialog",
  data () {
    return {
      valid: false,
      vehicleTypes: ['e-bike', 'e-scooter', 'other'],
      vehicleTypeValue: 'e-bike',
      vehicleDescription: null,
      descriptionRules: [
        v => !!v || 'Vehicle description is required',
      ],
      autocompleteRules: [
        v => !!v || 'Vehicle type is required',
      ],
      logo: null
    }
  },

  props:
  {
    dialog: Boolean
  },

  methods: {
    save() {
      switch(this.vehicleTypeValue) {
        case 'e-bike':
          this.logo = "mdi-bicycle"
          break;
        case 'e-scooter':
          this.logo = "mdi-scooter"
          break;
        default:
          this.logo = "mdi-arrow-right-bold-circle"
      }

      let newVehicle = {
        id: 3, //tbd real id from db
        description: this.vehicleDescription,
        type: this.vehicleTypeValue,
        logo: this.logo
      }

      //add vehicle to database
      //add vehicle to parent component

     // this.$emit("save")
      this.$emit("save", newVehicle)
    },
  },
}
</script>

<style scoped>

</style>
