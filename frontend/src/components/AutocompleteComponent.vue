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
      @click:append-inner="onClick"
    ></v-text-field>
  </v-col>
  <v-col class="flex-grow-0">
    <v-btn
      elevation="2"
      icon="mdi-map-marker"
      size="small"
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
  </v-col>
</template>

<script>
import axios from "axios";
import MapService from "@/services/map.service";
import {useGeolocation} from "@/map/GeolocationFuctions";
import {computed} from "vue";
export default {
  name: "UserLocation.vue",
  data() {
    return{
      loadingLocate: false,
      error:null,
      address:null,
    }
  },
  setup(){
    const {coords} = useGeolocation()
    const currPos = computed(()=>({
      lat: coords.value.latitude, lng:coords.value.longitude
    }))
    return {currPos}
  },
  mounted() {
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocomplete"),{
      bounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(48.137154,11.576124)
      )
    })

    autocomplete.addListener("place_changed",()=>{
      let place = autocomplete.getPlace();
      this.currPos.lat = place.geometry.location.lat()
      this.currPos.lng = place.geometry.location.lng()
      MapService.showUserLocationOnTheMap(this.currPos)
    })
  },
  methods:{
    onLocate(){
      axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + this.currPos.lat + "," +  this.currPos.lng + "&key=AIzaSyD3C3y44zQkaTFoaVzuQRW8a2g6-11Q1tI").then(response=>{
        if(response.data.error_message){
          this.error = response.data.error_message
        }else{
          this.address =  response.data.results[0].formatted_address;
        }
      }).catch(e =>{
        this.error=  e.message;
      })
      MapService.showUserLocationOnTheMap(this.currPos)
    },
  }
}
</script>

<style scoped>

</style>
