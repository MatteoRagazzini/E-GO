<template>
  <v-sheet class="pa-12" rounded>
    <v-card class="mx-auto px-6 py-8" max-width="344">
      <v-form
        v-model="form"
        @submit.prevent="onSubmit"
      >
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
          placeholder="Enter your password"
        ></v-text-field>

        <br>

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
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
      </v-form>
    </v-card>
  </v-sheet>
</template>
<script>

export default {
  data: () => ({
    form: false,
    username: null,
    password: null,
    loading: false,
    message: ""
  }),
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    onSubmit () {
      this.loading = true;
      this.$store.dispatch("auth/login", {"username":this.username, "password":this.password}).then(
        () => {
          this.$router.push("/profile");
        },
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
        console.log(error);
      });
    },
    required (v) {
      return !!v || 'Field is required'
    },
  },
}
</script>
