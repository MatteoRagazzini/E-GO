<template>
  <div id="app">
    <v-app>
    <div v-if="!currentUser">
        <v-carousel>
          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            cover
          ></v-carousel-item>

          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
            cover
          ></v-carousel-item>

          <v-carousel-item>
              <v-btn to="/register" prepend-icon="mdi-vuetify" variant="tonal">
              Register
              </v-btn>
              <v-btn to="/login" prepend-icon="mdi-vuetify" variant="tonal" color="primary">
                Login
              </v-btn>
            <router-view></router-view>
          </v-carousel-item>
        </v-carousel>
    </div>
    <div v-if="currentUser">
      <home></home>
    </div>
    </v-app>
  </div>
</template>

<script>
import Home from "@/components/Home";

export default {
  data: () => ({
    user:{
      username: "",
      email: "",
    },
    slides:[
      'Fisrt',
      'Second',
      'Third'
    ]
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
