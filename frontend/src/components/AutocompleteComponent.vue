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
import {useGeolocation, changeLocation, setGeoLocation} from "@/map/GeolocationFuctions";
import {computed} from "vue";
export default {
  emits:['newLocation'],
  name: "UserLocation.vue",
  data() {
    return{
      loadingLocate: false,
      error: null,
      address: null,
      successful:true,
      currPos: {},
      currPosIsSet: false,
      searchedPos: {},
    }
  },
 created(){
   const {GeoCoords} = useGeolocation()
      const currPos = computed(()=>({
        lat: GeoCoords.value.latitude, lng:GeoCoords.value.longitude
      }))
   this.currPos = currPos
   // this is not working as expected
   if(currPos!= null) this.currPosIsSet = true
   return {currPos}

  },
  mounted() {

    const autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocomplete"), {
      bounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(48.137154, 11.576124)
      )
    });

    autocomplete.addListener("place_changed",()=>{
      let place = autocomplete.getPlace();
      this.searchedPos.lat = place.geometry.location.lat()
      this.searchedPos.lng = place.geometry.location.lng()
      // changeLocation(this.searchedPos)
    })
  },
  methods:{
    onLocate(){
      // this is not working as expected
      if(!this.currPosIsSet)console.log("position not ready")
      else{
        this.loadingLocate = true
        axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + this.currPos.lat + "," +  this.currPos.lng + "&key=AIzaSyD3C3y44zQkaTFoaVzuQRW8a2g6-11Q1tI").then(response=>{

          if(response.data.error_message){
            this.error = response.data.error_message
          }else{
            this.address =  response.data.results[0].formatted_address;
            console.log(this.address)
          }
          this.$emit('newLocation',this.currPos)
          // setGeoLocation()
          this.loadingLocate = false;
        }).catch(e =>{
          this.error=  e.message;
        })
      }
    },
  }
}
</script>

<style scoped>

</style>
