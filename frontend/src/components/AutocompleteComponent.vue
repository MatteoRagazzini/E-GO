<template>
  <v-col class="flex-grow-1">
    <v-text-field
      density="compact"
      variant="solo"
      v-model="address"
      id="autocomplete"
      clearable
      label="Address"
      placeholder="Enter your address"
      append-inner-icon="mdi-magnify"
      single-line
      hide-details
      rounded
    ></v-text-field>
  </v-col>
  <v-col class="flex-grow-0">
    <v-btn
      elevation="2"
      icon="mdi-map-marker"
      size="small"
      :loading="loadingLocate"
      @click="onLocate"
    >
    </v-btn>
    <div
      v-if="error"
      class="alert"
      :class="successful ? 'alert-success' : 'alert-danger'"
    >
      {{ error }}
    </div>
  </v-col>
</template>

<script>
import axios from "axios";
export default {
  emits:['newLocation'],
  props:['coords'],
  name: "UserLocation.vue",
  data() {
    return{
      loadingLocate: false,
      error: null,
      address: null,
      successful:true,
      searchedPos: {},
    }
  },
  mounted() {
    const autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocomplete"), {
      bounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(this.coords)
      )
    });

    autocomplete.addListener("place_changed",()=>{
      let place = autocomplete.getPlace();
      this.searchedPos.lat = place.geometry.location.lat()
      this.searchedPos.lng = place.geometry.location.lng()
      this.$emit('newLocation',this.searchedPos)
    })
  },
  methods:{
    onLocate(){
        this.loadingLocate = true
        axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + this.coords.lat + "," +  this.coords.lng + "&key=AIzaSyD3C3y44zQkaTFoaVzuQRW8a2g6-11Q1tI").then(response=>{

          if(response.data.error_message){
            this.error = response.data.error_message
          }else{
            this.address =  response.data.results[0].formatted_address;
            console.log(this.address)
          }
          this.$emit('newLocation',this.coords)
          this.loadingLocate = false;
        }).catch(e =>{
          this.error=  e.message;
        })
      }
    }
}
</script>

<style scoped>

</style>
