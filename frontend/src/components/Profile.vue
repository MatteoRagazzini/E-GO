<template>
  <v-card
    class="overflow-hidden"
  >
    <v-toolbar
    >
<!--        <v-icon>mdi-account</v-icon>-->
      <span class="px-3 text-h6">Your profile</span>
      <v-spacer></v-spacer>
      <v-btn
        color="green"
        fab
        size="small"
        @click="isEditing = !isEditing"
      >
        <v-icon v-if="isEditing">
          mdi-close
        </v-icon>
        <v-icon v-else>
          mdi-pencil
        </v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
        <div align="center">
        <v-avatar
          size="164"
          class="py-5"
        >
              <v-img
                :src=this.avatarImg
              ></v-img>
        </v-avatar>
      </div>
      <v-autocomplete
        v-model="this.avatar"
        :items="avatars"
        :disabled="!isEditing"
        label="Avatar"
        item-title="name"
        item-value="name"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-if="typeof item.raw !== 'object'" v-bind="props"></v-list-item>
            <v-list-item
              v-else
              v-bind="props"
              :prepend-avatar="item.raw.avatarImg"
              :title="item.raw.name"
              @click="selectAvatar"
            ></v-list-item>
        </template>
      </v-autocomplete>
      <v-text-field
        v-model="username"
        disabled
        color="white"
        label="Username"
      ></v-text-field>
      <v-text-field
        v-model="email"
        disabled
        color="white"
        label="E-mail"
      ></v-text-field>
      <v-autocomplete
        v-model="paymentOption"
        :disabled="!isEditing"
        :items="paymentOptions"
        color="white"
        item-title="name"
        item-value="abbr"
        label="Payment options"
      ></v-autocomplete>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!isEditing"
        color="success"
        @click="save"
      >
        Save
      </v-btn>
    </v-card-actions>
    <v-snackbar
      v-model="showSnackbar"
      :timeout="1800"
      absolute
      :color="snackbarColor"
      location="bottom left"
    >
      {{this.snackbarText}}
    </v-snackbar>
  </v-card>
</template>

<script>
import UserService from "@/services/user.service";
import imgUrlTiger from "@/assets/tiger.png";
import imgUrlPenguin from "@/assets/penguin.png";
import imgUrlHippo from "@/assets/hippo.png";
import imgUrlFox from "@/assets/fox.png";
import imgUrlMonkey from "@/assets/monkey.png";
import imgUrlPanda from "@/assets/panda.png";
import imgUrlNone from "@/assets/none.jpg";


export default {
  name: 'Profile',
  data () {
    return {
      showSnackbar: false,
      snackbarText: "",
      snackbarColor: "",
      username:"",
      email:"",
      isEditing: null,
      paymentOption: "Pay per use",
      paymentOptions: [
        { name: "Pay per use"},
        { name: "Subscription"},
      ],
      avatars:
         [ { name: 'Tiger', avatarImg: imgUrlTiger },
          { name: 'Penguin', avatarImg: imgUrlPenguin },
           { name: 'Hippo', avatarImg: imgUrlHippo },
          { name: 'Fox', avatarImg: imgUrlFox},
          { name: 'Monkey', avatarImg: imgUrlMonkey },
           { name: 'Panda', avatarImg: imgUrlPanda },
          { name: 'None', avatarImg: imgUrlNone },
         ],
      avatar: "None",
      avatarImg: imgUrlNone
    }
  },

  methods: {
    save () {
      this.isEditing = !this.isEditing
      //update user in backend
      UserService.updateProfile(this.currentUser._id, this.username, this.email, this.avatar)
        .then(res=>{
          //update user in store
          let updatedUser = this.currentUser
          updatedUser.username = this.username
          updatedUser.email = this.email
          updatedUser.profilePicture = this.avatar
          this.$store.dispatch("auth/updateProfile", updatedUser)
          this.$emit("save", this.avatar)
          this.showSnackbar = true
          this.snackbarColor = "green"
          this.snackbarText = "Profile saved correctly!"
        }).catch(err=>{
        this.showSnackbar = true
        this.snackbarColor = "red"
        this.snackbarText =  err.response.data.message
      })


    },

    selectAvatar(){
      switch(this.avatar) {
        case "Tiger":
          this.avatarImg = imgUrlTiger
          break;
        case "Penguin":
          this.avatarImg = imgUrlPenguin
          break;
        case "Hippo":
          this.avatarImg = imgUrlHippo
          break;
        case "Fox":
          this.avatarImg = imgUrlFox
          break;
        case "Monkey":
          this.avatarImg = imgUrlMonkey
          break;
        case "Panda":
          this.avatarImg = imgUrlPanda
          break;
        default:
          this.avatarImg = imgUrlNone
      }
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }

    this.username = this.$store.state.auth.user.username;
    this.email = this.$store.state.auth.user.email;
    this.avatar = this.$store.state.auth.user.profilePicture;

    this.selectAvatar()

  }
};
</script>
