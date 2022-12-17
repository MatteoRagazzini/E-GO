<!--<template>-->
<!--  <GMapAutocomplete-->
<!--    placeholder="Enter your addresss"-->
<!--    append-inner-icon="mdi-magnify"-->
<!--    id = "autoComplete"-->
<!--    @change="setPlace"-->
<!--    v-model="newAddress">-->
<!--  </GMapAutocomplete>-->

<!--  <v-btn-->
<!--      elevation="2"-->
<!--      icon="mdi-map-marker"-->
<!--      size="small"-->
<!--    >-->
<!--  </v-btn>-->
<!--  <div-->
<!--          v-if="error"-->
<!--          class="alert"-->
<!--          :class="successful ? 'alert-success' : 'alert-danger'"-->
<!--        >-->
<!--          {{ error }}>-->
<!--        </div>-->
<!--</template>-->
<!--<script>-->
<!--export default {-->
<!--  name: "UserLocation.vue",-->
<!--  data() {-->
<!--    return {-->
<!--      loadingLocate: false,-->
<!--      error: null,-->
<!--      address: null,-->
<!--      newAddress: null,-->
<!--    }-->
<!--  },-->
<!--  // setup() {-->
<!--  //   const {coords} = useGeolocation()-->
<!--  //   const currPos = computed(() => ({-->
<!--  //     lat: coords.value.latitude, lng: coords.value.longitude-->
<!--  //   }))-->
<!--  //   return {currPos}-->
<!--  // },-->
<!--  mounted() {-->
<!--    // document.getElementById("autoComplete").-->
<!--    //-->
<!--    // addListener("place_changed", () => {-->
<!--    //     console.log("yeahi")-->
<!--    //   }-->
<!--    // );-->

<!--    // autocomplete.addListener("place_changed", () => {-->
<!--    //   let place = this.newAdress;-->
<!--    //   console.log(place)-->
<!--    // });-->
<!--  },-->
<!--  methods: {-->
<!--    setPlace() {-->
<!--      console.log(this.newAddress)-->
<!--    },-->

<!--    //setPlace() {-->
<!--       // document.getElementById("autoComplete").addListener("place_changed", () => {-->
<!--       //   let place = this.newAdress;-->
<!--       //   console.log(place)-->
<!--      //   this.currPos.lat = place.geometry.location.lat();-->
<!--      //   this.currPos.lng = place.geometry.location.lng();-->
<!--      //   //MapService.showUserLocationOnTheMap(this.currPos)-->
<!--      // });-->
<!--    //}-->
<!--  }-->
<!--}-->

<!--</script>-->


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
import {useGeolocation, changeLocation, setGeoLocation} from "@/map/GeolocationFuctions";
import {computed} from "vue";
export default {
  name: "UserLocation.vue",
  data() {
    return{
      loadingLocate: false,
      error: null,
      address: null,
      successful:true,
      currPos: {},
      searchedPos: {},
    }
  },
 created(){
   console.log("here")

   const {GeoCoords} = useGeolocation()
      const currPos = computed(()=>({
        lat: GeoCoords.value.latitude, lng:GeoCoords.value.longitude
      }))
   this.currPos = currPos
   return {currPos}

  },
  mounted() {

    // const map = new google.maps.Map(document.getElementById("map"), {
    //   center: { lat: -33.8688, lng: 151.2195 },
    //   zoom: 13,
    //   mapTypeId: "roadmap",
    // });


    var autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocomplete"),{
      bounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(48.137154,11.576124)
      )
    })

    autocomplete.addListener("place_changed",()=>{
      let place = autocomplete.getPlace();
      this.searchedPos.lat = place.geometry.location.lat()
      this.searchedPos.lng = place.geometry.location.lng()
      console.log(this.searchedPos)
      console.log(this.$store.state.LocationStore)
      this.$store.state.LocationStore.searchedPos = this.searchedPos
      this.$store.state.LocationStore.center = this.searchedPos
      console.log(this.$store.state.LocationStore)
      //this.resetMap()
      changeLocation(this.searchedPos)
      //map = document.getElementById("map")
      //map.setCenter(this.searchedPos);

    })
  },
  methods:{

    resetMap(){
      var map = document.getElementById("mother")
      console.log(map)
      this.$store.dispatch('LocationStore/changeCenter', this.searchedPos);
      // if(map){
      //   map.setCenter(this.searchedPos)
      // }
    },

    onLocate(){
      if(this.currPos == null)console.log("position not ready")
      else{
        console.log(this.currPos)
        this.loadingLocate = true
        axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + this.currPos.lat + "," +  this.currPos.lng + "&key=AIzaSyD3C3y44zQkaTFoaVzuQRW8a2g6-11Q1tI").then(response=>{

          if(response.data.error_message){
            this.error = response.data.error_message
            console.log("error")
          }else{
            this.address =  response.data.results[0].formatted_address;
            console.log(this.address)
          }
          setGeoLocation()
          this.loadingLocate = false;
          // if(this.currPos) {
          // this.$store.state.LocationStore.currPos = this.currPos
          // this.$store.state.LocationStore.center = this.currPos
          // document.getElementById("recenterComponent").click()
          // this.loadingLocate = false

          // }
        }).catch(e =>{
          this.error=  e.message;
        })

        //MapService.showUserLocationOnTheMapNew(this.currPos)
      }
    },
  }
}
</script>

<style scoped>

</style>
