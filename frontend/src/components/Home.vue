<template>
  <v-app>
    <v-app-bar :elevation="15" rounded>
      <v-container class="flex-row">
        <v-row>
          <autocompleteComponent @newLocation="updateLocation" v-if="!this.isHidden"></autocompleteComponent>
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
  data () {
    return {
      isHidden: false,
      infoCharged: false,
      coords: {lat:48.1351253, lng: 11.5819806}
    }
  },
  methods: {
    updateLocation(newLocation){
      this.location = newLocation
    },
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
    autocompleteComponent: AutocompleteComponent
  }
}
</script>

<style scoped>

</style>
