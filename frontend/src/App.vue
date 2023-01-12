<template>
    <v-app>
      <template v-if="!currentUser">
  <!--        <v-carousel-->
  <!--          height="auto"-->
  <!--        >-->
  <!--          <v-carousel-item-->
  <!--            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"-->
  <!--            cover-->
  <!--          ></v-carousel-item>-->

  <!--          <v-carousel-item-->
  <!--            src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"-->
  <!--            cover-->
  <!--          ></v-carousel-item>-->

  <!--          <v-carousel-item>-->
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
  <!--            <br>-->
  <!--          </v-carousel-item>-->
  <!--        </v-carousel>-->
      </template>
      <template v-if="user">
          <home></home>
      </template>
    </v-app>
</template>

<script>
import Home from "@/components/Home";
import socket from "@/socket";

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
    usernameAlreadySelected: false
  }),
  computed: {
    currentUser() {
      this.user = this.$store.state.auth.user;
      return this.user
    },
  },
  created() {
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
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
  },
  destroyed() {
    socket.off("connect_error");
  }
};
</script>
