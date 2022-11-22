<template>
  <v-card class="mx-auto px-6 py-8" max-width="500"  max-height="200" style="position:relative;z-index:1;">
    <v-container class="grey lighten-5" fill-height>
    <v-form
    >
      <v-row>
        <v-col
          cols="4"
          sm="9">
          <v-text-field
            v-model="address"
            id="autocomplete"
            class="mb-2"
            clearable
            label="Address"
            placeholder="Enter your address"
          ></v-text-field>
        </v-col>
        <v-col
          cols="4"
          sm="3">
          <v-btn
            elevation="2"
            icon="mdi-map-marker"
            x-large
            :loading="loadingLocate"
            @click="onLocate">
          </v-btn>
        </v-col>
      </v-row>au
    </v-form>
    </v-container>
    <div
      v-if="error"
      class="alert"
      :class="successful ? 'alert-success' : 'alert-danger'"
    >
      {{ error }}
    </div>
    </v-card>
  <v-sheet id="map" class="pa-12" rounded></v-sheet>
</template>

<script>

import axios from "axios";
export default {
  name: "UserLocation.vue",
  data() {
    return{
      address: null,
      error: null,
      loadingLocate: false
    }
  },
  mounted() {
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocomplete"),{
      bounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(48.137154,11.576124)
      )
    })

    autocomplete.addListener("place_changed",()=>{
      let place = autocomplete.getPlace();
      this.showUserLocationOnTheMap(place.geometry.location.lat(), place.geometry.location.lng());
    })
  },
  methods:{
    onLocate(){
      if(navigator.geolocation){
        this.successful = false;
        this.loadingLocate = true;
        navigator.geolocation.getCurrentPosition(
          position =>{
          this.getAddressForm(position.coords.latitude, position.coords.longitude)
            this.showUserLocationOnTheMap(position.coords.latitude, position.coords.longitude);
            this.successful = true;
            this.loadingLocate = false;
        },error =>{
            this.loadingLocate = false;
            this.successful = false;
          this.error = error.message
        });

      }else{
        console.log("you browser is not supporting geolocation API");
      }
    },

    getAddressForm(lat, long){

      axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," +  long + "&key=AIzaSyD3C3y44zQkaTFoaVzuQRW8a2g6-11Q1tI").then(response=>{
        if(response.data.error_message){
          this.error = response.data.error_message
          console.log(response.data.error_message)
        }else{
          this.address = response.data.results[0].formatted_address;
        }
      })
      .catch(error =>{
        this.error = error.message;
      })
    },
    showUserLocationOnTheMap(latitude, longitude){
      let map = new google.maps.Map(document.getElementById("map"),{
        zoom:15,
        center:new google.maps.LatLng(latitude,longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      })

      new google.maps.Marker({
        position:new google.maps.LatLng(latitude,longitude),
        map: map

      })
    }

  }
}
</script>

<style>
.pac-icon {
  display: none;
}
  .pac-item{
    padding: 5px;
    font-size: 14px;
    cursor: pointer;
  }

  .pac-item:hover{
    background-color:#ececec;
  }

  .pac-item-query{
    font-size: 14px;
  }

  #map{
    position: absolute;
    top:0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #0b2e13;
  }
</style>
