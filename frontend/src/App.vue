<template>
  <div id="app">
    <v-app>
    <div v-if="!currentUser">
        <v-carousel
          height="auto"
        >
          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            cover
          ></v-carousel-item>

          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
            cover
          ></v-carousel-item>

          <v-carousel-item>
            <v-container>
              <br>
              <v-row align="center"
                     justify="center"
                     style="gap: 1rem">
              <v-btn to="/register" variant="tonal">
              Register
              </v-btn>
              <v-btn to="/login" variant="tonal">
                Login
              </v-btn>
              </v-row>
            </v-container>
            <router-view></router-view>
            <br>
          </v-carousel-item>
        </v-carousel>
    </div>
    <div v-if="user && showMap">
      <home></home>
    </div>
    </v-app>
  </div>
</template>

<script>
import Home from "@/components/Home";
import StationService from "@/services/station.service";

export default {
  data: () => ({
    user:{
      username: "",
      email: "",
    },
    slides:[
      'First',
      'Second',
      'Third'
    ],
    showMap: true,
    stations: null,
  }),
  computed: {
    currentUser() {
      this.user = this.$store.state.auth.user;
      return this.user
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_ADMIN');
      }

      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_MODERATOR');
      }

      return false;
    }

  },
  async created(){
    const response =  await StationService.getStation()
    console.log(1)
    var stations = await response.data
    console.log(2)
    this.stations = stations
    console.log(3)
    this.$store.state.LocationStore.stations = stations
    console.log(stations)
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  },
  components:{
    home: Home
  }
};
</script>
