<template>
  <v-app>
    <v-app-bar :elevation="15" rounded>
      <v-container class="flex-row">
        <v-row>
          <autocompleteComponent v-if="!this.isHidden" v-model="currentPos"></autocompleteComponent>
<!--         this is a trick which is not nice-->
          <v-col class="flex-grow-1" v-if="this.isHidden"></v-col>
          <v-col class="flex-grow-0">
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
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-container>
    <v-main>
<!--      This is the main of the application where the pages changes based on the router map/charger-->
      <router-view></router-view>
    </v-main>
    </v-container>
    <v-bottom-navigation>
      <v-btn value="recent">
        <v-icon>mdi-history</v-icon>

        Recent
      </v-btn>

      <v-btn to="/userLocation" value="Map" @click="showLocationSearch">
        <v-icon>mdi-map</v-icon>

        Map
      </v-btn>
      <v-btn value="charging" to="/chargingStatus" @click="hideLocationSearch">
        <v-badge
          dot
          avatar
          color="red"
          overlap
          :value="infoCharged"
        >
        <v-icon>mdi-battery</v-icon>
        </v-badge>
        Charging

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
import ChargingStatus from "@/components/ChargingStatus";

const GOOGLE_MAPS_API_KEY = 'AIzaSyD3C3y44zQkaTFoaVzuQRW8a2g6-11Q1tI'
export default {
  name: "Home",
  data () {
    return{
      isHidden: false,
      infoCharged: false,
    }
  },
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
    },
    hideLocationSearch(){
      if (this.isHidden !== true){
          this.isHidden = true
      }
    },
    showLocationSearch(){
      this.isHidden = false
    },
  },
  components:{
    ChargingStatus,
    UserLocation,
    autocompleteComponent: AutocompleteComponent
  }
}
</script>

<style scoped>

</style>
