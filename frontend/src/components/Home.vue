<template>
  <v-app>
    <v-app-bar :elevation="15" rounded>
      <v-container class="flex-row">
        <v-row>
          <autocompleteComponent @newLocation="updateLocation"  :coords="this.coords" v-if="!this.isHidden"></autocompleteComponent>
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
        <googleMap :coords="this.coords"></googleMap>
        <!--      <router-view></router-view>-->
      </v-main>
    </v-container>
    <v-bottom-navigation>
      <v-btn to="/vehicles" value="VehicleOverview" @click="hideLocationSearch">
        <v-icon>mdi-bicycle</v-icon>

        Vehicles
      </v-btn>

      <v-btn to="/map" value="Map">
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
import AutocompleteComponent from "@/components/AutocompleteComponent";
import Map from "@/components/Map.vue";

export default {
  name: "Home",
  data() {
    return {
      isHidden: false,
      infoCharged: false,
      coords: {},
      watcher: null
    }
  },
  mounted() {
    const isSupported = 'navigator' in window && 'geolocation' in navigator
        if(isSupported){
          this.watcher = navigator.geolocation.watchPosition(
            position => {
              this.coords.lat = position.coords.latitude
              this.coords.lng = position.coords.longitude
            }
          )
        }
  },
  unmounted() {
    if(this.watcher) navigator.geolocation.clearWatch(this.watcher)
  },
  computed: {
    coords() {
      return {
        lat: this.geolocation.GeoCoords.latitude,
        lng: this.geolocation.GeoCoords.longitude
      }
    }
  },
  methods: {
    updateLocation(newLocation) {
      console.log("updating location in response of the emit from the AutocompleteComponent")
      this.coords.lat = newLocation.lat;
      this.coords.lng = newLocation.lng;
      console.log(this.coords)
    },
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
    hideLocationSearch() {
      if (this.isHidden !== true) {
        this.isHidden = true
      }
    },
    showLocationSearch() {
      this.isHidden = false
    },
  },
  components: {
    autocompleteComponent: AutocompleteComponent,
    googleMap: Map
  }
}
</script>

<style scoped>

</style>
