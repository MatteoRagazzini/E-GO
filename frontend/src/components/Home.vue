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
        <v-window v-model="tab">
          <v-window-item value="Map"
          >
            <v-card>
              <googleMap :coords="this.coords"></googleMap>
            </v-card>
          </v-window-item>
          <v-window-item value="vehicles"
          >
            <v-card>
              <vehicle-overview></vehicle-overview>
            </v-card>
          </v-window-item>
          <v-window-item value="Charging"
          >
            <v-card>
              <charging-status></charging-status>
            </v-card>
          </v-window-item>
        </v-window>
      </v-main>
    </v-container>
    <v-bottom-navigation>
      <v-tabs
        v-model="tab"
        centered
        bg-color="transparent"
        color="green"
        icons-and-text
      >
        <v-tab value="Map">
          <v-icon>mdi-map</v-icon>

          Map
        </v-tab>
        <v-tab value="vehicles">
          <v-icon>mdi-bicycle</v-icon>

          Vehicles
        </v-tab>
        <v-tab value="Charging">
          <v-icon>mdi-battery</v-icon>

          Charging
        </v-tab>
      </v-tabs>
<!--      <v-btn :to="{-->
<!--        name: 'map',-->
<!--        params: {coords:1},-->
<!--        }"-->
<!--             value="Map">-->
<!--        <v-icon>mdi-map</v-icon>-->

<!--        Map-->
<!--&lt;!&ndash;      </v-btn>&ndash;&gt;-->

<!--      <v-btn @click="goToMap">-->
<!--        <v-icon>mdi-map</v-icon>-->
<!--        Map-->
<!--      </v-btn>-->

<!--      <v-btn value="charging" to="/chargingStatus" @click="hideLocationSearch">-->
<!--        <v-badge-->
<!--          dot-->
<!--          avatar-->
<!--          color="red"-->
<!--          overlap-->
<!--          :value="infoCharged"-->
<!--        >-->
<!--          <v-icon>mdi-battery</v-icon>-->
<!--        </v-badge>-->
<!--        Charging-->

<!--      </v-btn>-->
    </v-bottom-navigation>
  </v-app>
</template>


<script>
import AutocompleteComponent from "@/components/AutocompleteComponent";
import Map from "@/components/Map.vue";
import VehicleOverview from "@/components/VehicleOverview.vue";
import ChargingStatus from "@/components/ChargingStatus.vue";

export default {
  name: "Home",
  data() {
    return {
      tab: "VehicleOptions",
      isHidden: false,
      infoCharged: false,
      coords: {lat:48.15143929407981,lng:11.580534476878478},
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
  methods: {
    // goToMap(){
    //   this.$router.push({name:"map",params:{coords:1}})
    // },
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
    ChargingStatus,
    Map,
    VehicleOverview,
    autocompleteComponent: AutocompleteComponent,
    googleMap: Map
  }
}
</script>

<style scoped>

</style>
