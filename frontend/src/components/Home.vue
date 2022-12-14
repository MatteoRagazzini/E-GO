<template>
  <v-app>
    <v-app-bar :elevation="15" rounded>
<!--        <autocompleteComponent></autocompleteComponent>-->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              v-bind="props"
              icon="mdi-dots-vertical"
            ></v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title @click="logOut">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
    </v-app-bar>
    <v-main>
<!--        <div class="m-auto">-->
<!--          <h4>Your position</h4>-->
<!--          Latitude : {{currentPos.lat.toFixed(2)}}, Longitude: {{currentPos.lng.toFixed(2)}}-->
<!--        </div>-->
<!--      <div ref="mapDiv" style="width: 100%; height: 80vh"/>-->
      <GoogleMaps :center="{lat: 50.137154, lng: 11.576124}"></GoogleMaps>
    </v-main>
    <v-bottom-navigation>
      <v-btn value="recent">
        <v-icon>mdi-history</v-icon>

        Recent
      </v-btn>

      <v-btn value="favorites">
        <v-icon>mdi-heart</v-icon>

        Favorites
      </v-btn>

      <v-btn value="nearby">
        <v-icon>mdi-map-marker</v-icon>

        Nearby
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>
<script>
/* eslint-disable no-undef */
import {useGeolocation} from "@/map/GeolocationFuctions";
import {computed, onMounted, ref} from "vue";
// import {Loader} from '@googlemaps/js-api-loader'
import UserLocation from "@/components/UserLocation";
import AutocompleteComponent from "@/components/AutocompleteComponent";
import GoogleMaps from "@/components/GoogleMaps";

// const GOOGLE_MAPS_API_KEY = 'AIzaSyD3C3y44zQkaTFoaVzuQRW8a2g6-11Q1tI'
export default {
  name: "Home",
  // setup(){
  //   const {coords} = useGeolocation()
  //   const currentPos = computed(()=>({
  //     lat: coords.value.latitude,
  //     lng: coords.value.longitude
  //   }))
  //
  //   const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY})
  //   const mapDiv = ref(null)
  //   onMounted(async ()=>{
  //     await loader.load()
  //     new google.maps.Map(mapDiv.value,{
  //       center: {
  //         lat: 48.17,
  //         lng: 11.59
  //       },
  //       zoom: 15
  //     })
  //   })
  //   return {currentPos, mapDiv}
  // },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  },
  components:{
    GoogleMaps,
    userlocationpage : UserLocation,
    autocompleteComponent: AutocompleteComponent
  }
}
</script>

<style scoped>

</style>
