<template>
  <v-sheet class="pa-12" rounded>
  <v-card class="mx-auto px-6 py-8" max-width="344">
    <v-card-item>
      <v-card-title>{{currentUser.username}}</v-card-title>

      <v-card-subtitle>Token:{{currentUser.accessToken.substring(0, 20)}} ... {{currentUser.accessToken.substr(currentUser.accessToken.length - 20)}}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <p>
        <strong>Id:</strong>
        {{currentUser.id}}
      </p>
      <p>
        <strong>Email:</strong>
        {{currentUser.email}}
      </p>
      <strong>Authorities:</strong>
      <ul>
        <li v-for="role in currentUser.roles" :key="role">{{role}}</li>
      </ul>
    </v-card-text>
  </v-card>
  </v-sheet>
</template>

<script>
export default {
  name: 'Profile',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  }
};
</script>
