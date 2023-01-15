<template>
    <v-app-bar :elevation="15" rounded>
      <v-container class="flex-row">
        <v-row>
          <AutocompleteComponent @newLocation="updateLocation" :geoCords="this.geoCords" v-if="this.tab==='Map'"></AutocompleteComponent>

          <v-col class="flex-grow-1" v-if="this.tab!=='Map'"></v-col>
          <v-col class="flex-grow-0">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  color="primary"
                  v-bind="props"
                  icon
                >
                  <v-avatar>
<!--                    <img></img>-->
                    <v-img
                      :src=this.avatarImg
                    ></v-img>
                  </v-avatar>
                </v-btn>
              </template>
              <v-card>
<!--                <v-list-item-content class="justify-center">-->
                  <div class="mx-auto text-center">
                    <v-avatar
                    >
                      <v-img
                        :src=this.avatarImg
                      ></v-img>
                    </v-avatar>
                    <h3>{{ this.currentUser.username }}</h3>
                    <p class="text-caption mt-1">
                      {{ this.currentUser.email }}
                    </p>
                    <v-divider class="my-3"></v-divider>
                    <v-btn
                      rounded
                      variant="text"
                      @click="switchTab('Profile')"
                    >
                      Edit Profile
                    </v-btn>
                    <v-divider class="my-3"></v-divider>
                    <v-btn
                      rounded
                      variant="text"
                      @click="logOut"
                    >
                      Logout
                    </v-btn>
                  </div>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
      <v-main>
        <v-window v-model="tab">
          <v-window-item value="Map"
          >
            <v-card>
<!--              coords are passed to the map since they can be changed by the sibling "Autocomplete"-->
              <Map :coords="this.coords"  @switchTab="switchTab" ref="Map"></Map>
            </v-card>
          </v-window-item>
          <v-window-item value="Vehicles"
          >
            <v-card>
              <vehicle-overview v-if="currentUser!==undefined"></vehicle-overview>
            </v-card>
          </v-window-item>
          <v-window-item value="Charges"
          >
            <v-card>
              <charging-status @switchTab="switchTab"></charging-status>
            </v-card>
          </v-window-item>
          <v-window-item value="Profile"
          >
            <v-card>
              <profile @save="updateAvatar"></profile>
            </v-card>
          </v-window-item>
        </v-window>
      </v-main>
    <v-bottom-navigation>
      <v-tabs
        v-model="tab"
        centered
        bg-color="transparent"
        color="green"
        icons-and-text
      >
        <v-tab value="Vehicles">
          <v-icon>mdi-bicycle</v-icon>

          Vehicles
        </v-tab>
        <v-tab value="Map">
          <v-icon>mdi-map</v-icon>

          Map
        </v-tab>
        <v-tab value="Charges">
          <v-icon>mdi-battery</v-icon>

          Charges
        </v-tab>
      </v-tabs>
    </v-bottom-navigation>
</template>


<script>
import AutocompleteComponent from "@/components/AutocompleteComponent.vue";
import Map from "@/components/Map.vue";
import VehicleOverview from "@/components/VehicleOverview.vue";
import ChargingStatus from "@/components/ChargingStatus.vue";
import Profile from "@/components/Profile.vue";
import imgUrlTiger from "@/assets/tiger.png";
import imgUrlPenguin from "@/assets/penguin.png";
import imgUrlHippo from "@/assets/hippo.png";
import imgUrlFox from "@/assets/fox.png";
import imgUrlMonkey from "@/assets/monkey.png";
import imgUrlPanda from "@/assets/panda.png";
import imgUrlNone from "@/assets/none.jpg";

export default {
  name: "Home",
  data() {
    return {
      tab: "Map",
      isHidden: false,
      infoCharged: false,
      coords: {lat:48.15143929407981,lng:11.580534476878478},
      geoCords: {lat:48.15143929407981,lng:11.580534476878478},
      watcher: null,
      avatar: "None",
      avatarImg: ""
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    status(){
      return this.$store.state.userState;
    }
  },
  mounted() {
    const isSupported = 'navigator' in window && 'geolocation' in navigator
        if(isSupported){
          this.watcher = navigator.geolocation.watchPosition(
            position => {
              this.geoCords.lat = position.coords.latitude
              this.geoCords.lng = position.coords.longitude
            }
          )
        }
    this.avatar = this.currentUser.profilePicture
    this.selectAvatar()
  },
  unmounted() {
    if(this.watcher) navigator.geolocation.clearWatch(this.watcher)
  },
  methods: {
    switchTab(tab){
      this.tab = tab
    },
    updateLocation(newLocation) {
      console.log("updating location in response of the emit from the AutocompleteComponent")
      if(newLocation.lat === this.coords.lat && newLocation.lng === this.coords.lng){
        this.$refs.Map.setMapCenter(newLocation)
      }
        this.coords.lat = newLocation.lat;
        this.coords.lng = newLocation.lng;
      console.log(this.coords)
    },
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
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
    },
    updateAvatar(avatar){
      this.avatar = avatar
      this.selectAvatar()
    }

  },
  components: {
    Profile,
    ChargingStatus,
    VehicleOverview,
    AutocompleteComponent,
    Map
  },
}
</script>

<style scoped>

</style>
