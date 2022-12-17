<template>
<!--  <div class="text-center">-->
<!--    <v-sheet id="map" ref="mapDiv" class="pa-12" rounded></v-sheet>-->
<!--      <v-dialog-->
<!--        v-model="dialog"-->
<!--        id = "stationCard"-->
<!--      >-->
<!--        <v-card>-->
<!--          <v-card-text>-->
<!--            {{this.dialogText}}-->
<!--          </v-card-text>-->
<!--        </v-card>-->
<!--      </v-dialog>-->
<!--  </div>-->
  <v-card class="m-auto" >
    <h4>Your position</h4>
    Latitude : {{currPos.lat.toFixed(2)}} , Longitude: {{currPos.lng.toFixed(2)}}
  </v-card>
  <div ref="mapDiv" style="width:100%; height:80vh"/>
</template>

<script>


import imgUrl from "@/assets/charging-station.png";
import StationService from "@/services/station.service";
import {computed, onMounted, ref, watch} from "vue";
import {useGeolocation} from "@/map/GeolocationFuctions";

export default {
  name: "MapNew",
  // data() {
  //   return {
  //     dialog: false,
  //     info: "",
  //     map: null,
  //     dialogText: "",
  //     coords: useGeolocation()
  //   }
  // },
  setup() {
    const {coords} = useGeolocation()
    const currPos = computed(() => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude
    }))

    const mapDiv = ref(null)
    let map = ref(null)
    let clickListener = null

    onMounted(async () => {
      map.value = new google.maps.Map(mapDiv.value, {
        center: currPos.value,
        zoom: 13,
        mapId: "16c023e99af33056",
      })
    })

    watch([currPos], () => {
      console.log("poisition Changed! ")
      console.log("new position" + currPos.value.lat)
      map.value.setCenter(currPos.value)
    })
    return{currPos, mapDiv}

  }
}
</script>

      // computed(){
      //   const currPos = computed(() => ({
      //       lat: this.coords.value.latitude,
      //       lng: this.coords.value.longitude
      //     }))
      //   return currPos
      // },

      // mounted() {
      //   console.log(this.currPos)
      //   const map = new google.maps.Map(document.getElementById("map"), {
      //     center: this.currPos,
      //     zoom: 13,
      //     mapId: "16c023e99af33056",
      //   });

      // this.map = map
      //
      // const icon = {
      //   url: imgUrl, // url
      //   scaledSize: new google.maps.Size(40, 40), // scaled size
      //   origin: new google.maps.Point(0, 0), // origin
      //   anchor: new google.maps.Point(0, 0) // anchor
      // };

      // StationService.getStation().then(
      //   (response) => {
      //     var stations = response.data
      //     const availabilityTag = document.createElement("div");
      //     console.log(stations)
      //
      //     stations.forEach(station => {
      //       if (station.usedSpaces !== station.maxSpaces) {
      //         availabilityTag.className = "availability-tag available";
      //       } else {
      //         availabilityTag.className = "availability-tag unavailable";
      //       }
      //
      //       availabilityTag.textContent = station.usedSpaces + "/" + station.maxSpaces;
      //
      //       availabilityTag.id = station._id
      //       console.log(station._id)
      //       new google.maps.marker.AdvancedMarkerView({
      //         position: new google.maps.LatLng(station.latitude, station.longitude),
      //         content: availabilityTag,
      //         map
      //       }).addListener("click", () => {
      //         this.dialog = true
      //         this.dialogText = station._id
      //       })
      //     })
      //   })

}

  // methods: {
  //   reCenter(newCenter) {
  //     this.map.setCenter(newCenter)
  //   }
  // }

export default {
name: "UserLocation2.vue",
setup(){
const {coords} = useGeolocation()
const currPos = computed(() => ({
lat: coords.value.latitude,
lng: coords.value.longitude
}))

const loader = new Loader({
apiKey: GOOGLE_MAPS_API_KEY,
version: "beta",
libraries: ["places","marker"]
});

const mapDiv = ref(null)
let map = ref(null)
let clickListener = null

onMounted(async ()=>{
await loader.load()
map.value = new google.maps.Map(mapDiv.value,{
center: currPos.value,
zoom: 14
})
clickListener = map.value.addListener(
'click',
({ latLng: { lat, lng } }) =>
(otherPos.value = { lat: lat(), lng: lng() })
)
})
onUnmounted(async () => {
if (clickListener) clickListener.remove()
})

watch([currPos], () => {
map.value.setCenter(currPos.value)
})
return{currPos, mapDiv}
},

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

