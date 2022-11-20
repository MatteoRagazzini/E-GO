<!--<template>-->
<!--  <div id="app">-->
<!--  <v-card max-width="448" class="mx-auto" color="grey-lighten-3">-->
<!--    <v-layout>-->
<!--      <v-app-bar-->
<!--        color="teal-darken-4"-->
<!--        image="https://picsum.photos/1920/1080?random"-->
<!--      >-->
<!--        <template v-slot:image>-->
<!--          <v-img-->
<!--            gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"-->
<!--          ></v-img>-->
<!--        </template>-->

<!--        <template v-slot:prepend>-->
<!--          <v-app-bar-nav-icon>-->
<!--          </v-app-bar-nav-icon>-->
<!--        </template>-->

<!--        <v-app-bar-title>E-go</v-app-bar-title>-->

<!--        <v-spacer></v-spacer>-->
<!--        <v-btn icon>Home-->
<!--          <router-link icon to="/home">-->
<!--          </router-link>-->
<!--        </v-btn>-->
<!--        <li v-if="showAdminBoard" class="nav-item">-->
<!--          <router-link to="/admin" class="nav-link">Admin Board</router-link>-->
<!--        </li>-->
<!--        <li v-if="showModeratorBoard" class="nav-item">-->
<!--          <router-link to="/mod" class="nav-link">Moderator Board</router-link>-->
<!--        </li>-->
<!--        <li class="nav-item">-->
<!--          <router-link v-if="currentUser" to="/user" class="nav-link">User</router-link>-->
<!--        </li>-->
<!--        <v-spacer></v-spacer>-->
<!--        <div v-if="!currentUser" class="navbar-nav ml-auto">-->
<!--          <li class="nav-item">-->
<!--            <router-link to="/register" class="nav-link">-->
<!--              <font-awesome-icon icon="user-plus" /> Sign Up-->
<!--            </router-link>-->
<!--          </li>-->
<!--          <li class="nav-item">-->
<!--            <router-link to="/login" class="nav-link">-->
<!--              <font-awesome-icon icon="sign-in-alt" /> Login-->
<!--            </router-link>-->
<!--          </li>-->
<!--        </div>-->

<!--        <div v-if="currentUser" class="navbar-nav ml-auto">-->
<!--          <li class="nav-item">-->
<!--            <router-link to="/profile" class="nav-link">-->
<!--              <font-awesome-icon icon="user" />-->
<!--              {{ currentUser.username }}-->
<!--            </router-link>-->
<!--          </li>-->
<!--          <li class="nav-item">-->
<!--            <a class="nav-link" @click.prevent="logOut">-->
<!--              <font-awesome-icon icon="sign-out-alt" /> LogOut-->
<!--            </a>-->
<!--          </li>-->
<!--        </div>-->
<!--      </v-app-bar>-->
<!--      <v-main>-->
<!--        <router-view></router-view>-->
<!--      </v-main>-->
<!--    </v-layout>-->
<!--  </v-card>-->
<!--  </div>-->
<!--</template>-->


<!--<template>-->
<!--  <div id="app">-->
<!--      <v-layout>-->
<!--        <v-navigation-drawer-->
<!--          expand-on-hover-->
<!--          rail>-->
<!--          <v-list>-->
<!--            <v-list-item v-if="currentUser"-->
<!--              prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"-->
<!--              :title ="user.username"-->
<!--              :subtitle= "user.email"-->
<!--            ></v-list-item>-->
<!--            <v-list-item v-if="!currentUser"-->
<!--               prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"-->
<!--               title ="unknown"-->
<!--               subtitle= "unknown"-->
<!--            ></v-list-item>-->
<!--          </v-list>-->
<!--          <v-divider></v-divider>-->

<!--          <v-list density="compact" nav>-->
<!--              <router-link to="/home">-->
<!--                <v-list-item prepend-icon="mdi-home" title="home" value="home"/>-->
<!--              </router-link>-->
<!--              <v-list-item v-if="currentUser" prepend-icon="mdi-logout" title="logout" value="logout" @click.prevent="logOut"/>-->
<!--              <router-link to="/login">-->
<!--                <v-list-item v-if="!currentUser" prepend-icon="mdi-login" title="login" value="login"/>-->
<!--              </router-link>-->
<!--              <router-link to="/register">-->
<!--                <v-list-item v-if="!currentUser" prepend-icon="mdi-sign-up" title="sign-up" value="signup"/>-->
<!--              </router-link>-->
<!--          </v-list>-->
<!--        </v-navigation-drawer>-->
<!--        <v-main style="height: 500px">-->
<!--          <router-view></router-view>-->
<!--        </v-main>-->
<!--      </v-layout>-->
<!--  </div>-->
<!--</template>-->


<!--<script>-->
<!--import NavBarComponent from "@/components/NavBarComponent";-->

<!--export default {-->
<!--  data: () => ({-->
<!--    user:{-->
<!--      username: "",-->
<!--      email: "",-->
<!--    }-->
<!--  }),-->
<!--  computed: {-->
<!--    currentUser() {-->
<!--      this.user = this.$store.state.auth.user;-->
<!--      return this.user-->
<!--    },-->
<!--    showAdminBoard() {-->
<!--      if (this.currentUser && this.currentUser['roles']) {-->
<!--        return this.currentUser['roles'].includes('ROLE_ADMIN');-->
<!--      }-->

<!--      return false;-->
<!--    },-->
<!--    showModeratorBoard() {-->
<!--      if (this.currentUser && this.currentUser['roles']) {-->
<!--        return this.currentUser['roles'].includes('ROLE_MODERATOR');-->
<!--      }-->

<!--      return false;-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    logOut() {-->
<!--      this.$store.dispatch('auth/logout');-->
<!--      this.$router.push('/login');-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->



<template>
  <div id="app">
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
            <router-link to="/register">
              <v-btn prepend-icon="mdi-vuetify" variant="tonal">
              Register
              </v-btn>
            </router-link>
            <router-link to="/login">
              <v-btn prepend-icon="mdi-vuetify" variant="tonal">
                Login
              </v-btn>
            </router-link>
            <router-view></router-view>
          </v-carousel-item>
        </v-carousel>
    </div>
    <div v-if="currentUser">
      <home></home>
    </div>
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
