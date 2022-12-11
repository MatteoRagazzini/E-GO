<template>
  <div id="recenterComponent" @click="reCenter">
  <GMapMap
    ref = "myMap"
    :center="centerK"
    :zoom="zoom"
    map-type-id="terrain"
    style="width: 100%; height: 100vw; position: inherit !important; overflow: auto !important;"
    :disableDefaultUI="true"
    class = "vue-map"
    :options="{
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
    }"
  >

    <GMapCluster :zoomOnClick="true">
      <GMapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="openDialog(m.id)"
      />
    </GMapCluster>
  </GMapMap>
  <v-dialog
    v-model="dialog"
  >

    <v-card>
      <v-card-text>
        {{this.dialogText}}
        </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="dialog = false">Close Dialog</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </div>
</template>

<script>
import StationService from "@/services/station.service";
import {LocationStore} from "@/store/LocationStore";
import imgUrl from "@/assets/charging-station.png";

export default {
  data() {
    return {
      centerK: this.$store.state.LocationStore.center,
      markers: null,
      dialog: false,
      dialogText: "",
      currentPos: this.$store.state.LocationStore.currPos,
      zoom: 13,
    }
  },
  computed: {
    //  centerK() {
    //    return this.$store.state.LocationStore.center
    // }
  },
  async created(){
      const response = await StationService.getStation()
      var stations = await response.data
      var markers = []
      stations.forEach(function(station) {
        markers.push({
          id: station._id,
          position: {
            lat: station.latitude,
            lng: station.longitude,
          },
        });
      });
      this.markers = markers
  },
  methods: {
    openDialog(StationID) {
      this.dialog = true
      console.log(this.dialogText)
      this.dialogText = StationID
    },
    reCenter(){
      console.log("recentered")
      this.centerK = this.$store.state.LocationStore.center
      this.$refs.myMap
    },

    updateCenter() {
      console.log("update center")
      this.centerK = this.$store.state.LocationStore.center
    },
  },
};
</script>

<style>
body {
  margin: 0;
}
.vue-map > div{
  position: inherit !important;
  overflow: auto !important;
}
</style>


<!--<template>-->
<!--&lt;!&ndash;  <v-dialog&ndash;&gt;-->
<!--&lt;!&ndash;    v-model="dialog"&ndash;&gt;-->
<!--&lt;!&ndash;    id = "stationCard"&ndash;&gt;-->
<!--&lt;!&ndash;  >&ndash;&gt;-->
<!--&lt;!&ndash;  </v-dialog>&ndash;&gt;-->

<!--  <div class="text-center">-->
<!--    <v-sheet id="map" ref="map" class="pa-12" rounded></v-sheet>-->
<!--&lt;!&ndash;    <v-card id = "stationCard" style="visibility: hidden" v-model ="dialog">&ndash;&gt;-->
<!--&lt;!&ndash;    <v-card id = "stationCard" style="visibility: hidden" v-model ="dialog">&ndash;&gt;-->
<!--      <v-card id = "stationCard" @click="test(stationID)" style="visibility: hidden">-->
<!--      <v-card-text v-text="this.info">-->
<!--      </v-card-text>-->
<!--            <v-card-actions>-->
<!--              <v-btn color="primary" block @click="hideDialog">Close Dialog</v-btn>-->
<!--            </v-card-actions>-->
<!--    </v-card>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->

<!--import MapService from "@/services/map.service";-->
<!--import StationService from "@/services/station.service";-->
<!--import imgUrl from "@/assets/charging-station.png";-->

<!--export default {-->
<!--  name: "UserLocation.vue",-->
<!--  data() {-->
<!--    return {-->
<!--      dialog: false,-->
<!--      info: "",-->
<!--      stations: null,-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    //MapService.mapInit();-->
<!--    //MapService.loadStations();-->
<!--    //this.addClicktoStation();-->
<!--    //this.addClicktoStation();-->

<!--  },-->
<!--  async created() {-->

<!--    const response = await StationService.getStation()-->
<!--    var stations = await response.data-->
<!--    var markers = []-->
<!--    stations.forEach(function (station) {-->
<!--      markers.push({-->
<!--        id: station._id,-->
<!--        position: {-->
<!--          lat: station.latitude,-->
<!--          lng: station.longitude,-->
<!--        },-->
<!--      });-->
<!--    });-->
<!--    this.stations = markers-->

<!--    await MapService.mapInit();-->
<!--    await MapService.loadStations(stations);-->

<!--  },-->

<!--  methods: {-->

<!--    test(stationID) {-->
<!--        this.addClicktoStation()-->
<!--    },-->
<!--    hideDialog() {-->
<!--      document.getElementById("stationCard").style.visibility = "hidden"-->
<!--    },-->
<!--    addClicktoStation() {-->
<!--      //console.log(this.stations)-->
<!--      var searchID = String(this.stations[0].id)-->
<!--      //console.log(searchID)-->
<!--      //console.log(searchID)-->
<!--      //console.log(document.getElementById(searchID))-->
<!--      this.stations.forEach(function(station) {-->
<!--        console.log("here")-->
<!--        var searchID = String(station.id)-->
<!--        console.log(document.getElementById(searchID))-->



<!--       // console.log(document.getElementById(station.id))-->
<!--        // document.getElementById(station.id).addListener("click",()=> {-->
<!--        //   this.info = station.id-->
<!--        // })-->
<!--       })-->
<!--  }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style>-->



<!--/* HTML marker styles */-->
<!--.availability-tag {-->
<!--  border-radius: 8px;-->
<!--  color: #FFFFFF;-->
<!--  font-size: 14px;-->
<!--  padding: 10px 15px;-->
<!--  position: relative;-->
<!--}-->

<!--.available{-->
<!--  background-color: #1a912c;-->
<!--}-->

<!--.unavailable{-->
<!--  background-color: #c92020;-->
<!--}-->

<!--.availability-tag::after {-->
<!--  content: "";-->
<!--  position: absolute;-->
<!--  left: 50%;-->
<!--  top: 100%;-->
<!--  transform: translate(-50%, 0);-->
<!--  width: 0;-->
<!--  height: 0;-->
<!--  border-left: 8px solid transparent;-->
<!--  border-right: 8px solid transparent;-->
<!--  border-top: 8px solid #4285F4;-->
<!--}-->

<!--#map {-->
<!--  height: 100%;-->
<!--}-->

<!--/*-->
<!-- * Optional: Makes the sample page fill the window.-->
<!-- */-->
<!--html,-->
<!--body {-->
<!--  height: 100%;-->
<!--  margin: 0;-->
<!--  padding: 0;-->
<!--}-->

<!--[class$=api-load-alpha-banner] {-->
<!--  display: none;-->
<!--}-->

<!--.pac-icon {-->
<!--  display: none;-->
<!--}-->
<!--  .pac-item{-->
<!--    padding: 5px;-->
<!--    font-size: 14px;-->
<!--    cursor: pointer;-->
<!--  }-->

<!--  .pac-item:hover{-->
<!--    background-color:#ececec;-->
<!--  }-->

<!--  .pac-item-query{-->
<!--    font-size: 14px;-->
<!--  }-->

<!--  #map{-->
<!--    position: absolute;-->
<!--    top:0;-->
<!--    right: 0;-->
<!--    bottom: 0;-->
<!--    left: 0;-->
<!--    background: #0b2e13;-->
<!--  }-->
<!--</style>-->
