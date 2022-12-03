<template>
  <v-slide-y-transition>
  <StationCard id="stationCard" v-show="show" style="position:absolute;z-index: 1"></StationCard>
  </v-slide-y-transition>
  <div id="map">
    <div id="marker-test" class="availability-tag available">3/10</div>
  </div>
</template>

<script>

import MapService from "@/services/map.service";
import StationCard from "@/components/StationCard";

export default {
  name: "UserLocation.vue",
  components: {StationCard},
  data() {
    return{
      show:false
    }
  },
  mounted() {
    MapService.mapInit();
    MapService.loadStations(this.show)
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
    position: relative;
    height:100%;
    right: 0;
    bottom: 0;
    left: 0;
    background: #0b2e13;
  }
  #stationCard{
    position: absolute;
    bottom: 56px;
    height: 30%;
    width: 100%;
    border-radius: 30px 30px 0 0
  }
</style>
