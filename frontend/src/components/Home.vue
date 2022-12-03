<template>
  <v-app>
    <v-app-bar :elevation="15" rounded>
        <autocompleteComponent></autocompleteComponent>
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
<!--      <userlocationpage></userlocationpage>-->
      <google-map>
        <google-map-marker :stations="stations"></google-map-marker>
      </google-map>
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
import UserLocation from "@/components/UserLocation";
import AutocompleteComponent from "@/components/AutocompleteComponent";
import GoogleMap from "@/components/google-map";
import GoogleMapMarker from "@/components/google-map-marker";
import StationService from "@/services/station.service";
import imgUrl from "@/assets/charging-station.png";
import MapService from "@/services/map.service";

export default {
  name: "Home",
  data() {
    return {
      stations: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    listStations(){
      StationService.getStation().then(
        response => {
          console.log(response);
          this.stations = response.data
        }
      )
    },
    init(){
      this.listStations();
    },
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  },
  components:{
    GoogleMapMarker,
    GoogleMap,
    userlocationpage : UserLocation,
    autocompleteComponent: AutocompleteComponent
  }
}
</script>

<style scoped>

</style>

listMovies: function () {
axios.get("http://localhost:3000/api/movies")
//.then(response => (console.log(response.data)))
.then(response => {
this.movies = response.data
this.movies.forEach(function(movie) {
if(movie.poster!=null) movie.poster = movie.poster.replace("http://ia.media-imdb.com/", "https://m.media-amazon.com/")
});
})
.catch(error => (console.log(error)));

},
init: function(){
this.listMovies();
}
},
mounted(){
this.init()
