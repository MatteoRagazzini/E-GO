<template>
  <v-sheet class="pa-12" rounded>
    <v-card class="mx-auto px-6 py-8 justify-center" max-width="344">
      <v-form
        v-model="form"
        @submit.prevent="onSubmit()"
      >

        <v-img
          :src=this.url
          cover
          width="100"
          class="mx-auto"
        >
        </v-img>


        <v-text-field
          v-model="username"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Username"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          clearable
          label="Password"
          type="password"
          placeholder="Enter your password"
        ></v-text-field>


        <v-btn
          :disabled="!form"
          :loading="loading"
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
        >
          Sign In
        </v-btn>
        <br>
        <v-snackbar
          v-model="showSnackbar"
          :timeout="3000"
          absolute
          location="bottom right"
          color="red"
        >
          {{ this.message }}
        </v-snackbar>
      </v-form>
    </v-card>
  </v-sheet>
</template>
<script>

import imgUrl from "@/assets/Logo_Matteo.png";
import socket from "@/socket";


export default {

  data: () => ({
    form: false,
    username: null,
    password: null,
    loading: false,
    message: "",
    url: imgUrl,
    showSnackbar: false,
  }),
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  methods: {
    onSubmit () {
      this.loading = true;
      this.$store.dispatch("auth/login", {"username":this.username, "password":this.password}).then(
        (error) => {

          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      ).catch((error)=>{
        this.loading = false;
        this.message=error
        this.showSnackbar = true
        console.log(error);
      });
    },
    required (v) {
      return !!v || 'Field is required'
    },
  },
}
</script>
