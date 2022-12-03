<template>
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
    @click:append-inner="onClick"
  ></v-text-field>
            <v-btn
              elevation="2"
              icon="mdi-map-marker"
              x-large
              :loading="loadingLocate"
              @click="onLocate">
            </v-btn>
    <div
      v-if="error"
      class="alert"
      :class="successful ? 'alert-success' : 'alert-danger'"
    >
      {{ error }}
    </div>
</template>

<script>
import axios from "axios";
import MapService from "@/services/map.service";
export default {
  name: "UserLocation.vue",
  data() {
    return{
      address: null,
      error: null,
      loadingLocate: false,
    }
  },
  mounted() {
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocomplete"),{
      bounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(48.137154,11.576124)
      )
    })

    autocomplete.addListener("place_changed",()=>{
      let place = autocomplete.getPlace();
      MapService.showUserLocationOnTheMap(place.geometry.location.lat(), place.geometry.location.lng())
    })
  },
  methods:{
    onLocate(){
      if(navigator.geolocation){
        this.successful = false;
        this.loadingLocate = true;
        navigator.geolocation.getCurrentPosition(
          position =>{
            this.getAddressForm(position.coords.latitude, position.coords.longitude)
            MapService.showUserLocationOnTheMap(position.coords.latitude, position.coords.longitude)
            this.successful = true;
            this.loadingLocate = false;
          },error =>{
            this.loadingLocate = false;
            this.successful = false;
            this.error = error.message
          });

      }else{
        console.log("you browser is not supporting geolocation API");
      }
    },

    getAddressForm(lat, long){

      axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," +  long + "&key=AIzaSyD3C3y44zQkaTFoaVzuQRW8a2g6-11Q1tI").then(response=>{
        if(response.data.error_message){
          this.error = response.data.error_message
          console.log(response.data.error_message)
        }else{
          this.address = response.data.results[0].formatted_address;
        }
      })
        .catch(error =>{
          this.error = error.message;
        })
    },
  }
}
</script>

<style scoped>

</style>
