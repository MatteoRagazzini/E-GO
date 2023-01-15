<template>
  <div id="app">
    <v-app>
      <div v-if="!currentUser">
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
      </div>
      <div v-if="user">
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
  }),
  computed: {
    currentUser() {
      this.user = this.$store.state.auth.user;
      return this.user
    },
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
