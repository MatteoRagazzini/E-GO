<template>
  <v-sheet id="map" class="pa-12" rounded></v-sheet>
<!--  <div id="stationCard">-->
<!--    <v-field>10/10</v-field>-->
<!--    <v-btn>-->
<!--      START-->
<!--    </v-btn>-->
<!--    <v-btn>-->
<!--      RESERVE-->
<!--    </v-btn>-->
<!--  </div>-->
</template>

<script>

import MapService from "@/services/map.service";

export default {
  name: "UserLocation.vue",
  data() {
    return{}
  },
  mounted() {
    MapService.mapInit();
    MapService.loadStations()

  },
  methods:{
  }
}
</script>

<style>

/* HTML marker styles */
.availability-tag {
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 14px;
  padding: 10px 15px;
  position: relative;
}

.available{
  background-color: #1a912c;
}

.unavailable{
  background-color: #c92020;
}

.availability-tag::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translate(-50%, 0);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #4285F4;
}

#map {
  height: 100%;
}

/*
 * Optional: Makes the sample page fill the window.
 */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

[class$=api-load-alpha-banner] {
  display: none;
}

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
