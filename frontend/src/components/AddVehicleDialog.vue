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
              v-model="vehicleName"
              :rules="nameRules"
              color="white"
              label="Name"
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
      vehicleName: null,
      nameRules: [
        v => !!v || 'Vehicle name is required',
      ],
      autocompleteRules: [
        v => !!v || 'Vehicle type is required',
      ],
      icon: null
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
          this.icon = "mdi-bicycle"
          break;
        case 'e-scooter':
          this.icon = "mdi-scooter"
          break;
        default:
          this.icon = "mdi-alpha-e-circle"
      }

      let newVehicle = {
        name: this.vehicleName,
        vehicleType: this.vehicleTypeValue,
        icon: this.icon,
        batteryLevel: null,
        isCharging: false,
        isCurrent: false,
      }

      this.$emit("save", newVehicle)
    },
  },
}
</script>

<style scoped>

</style>
