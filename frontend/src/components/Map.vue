<template>
  <!--  <v-card class="m-auto" >-->
  <!--    <h4>Your position</h4>-->
  <!--    Latitude : {{currPos.lat.toFixed(2)}} , Longitude: {{currPos.lng.toFixed(2)}}-->
  <!--  </v-card>-->
  <div ref="mapDiv" style="width:100%; height:80vh"/>
  <StationCard
    v-model="state.dialog"
    :id="state.dialogText"/>
</template>



<!--This is a component realized with the composition API. Which means no return.-->
<!--I would like to write this component like a normal vue component because it's more readable I think-->
<script setup>

  import StationService from "@/services/station.service";
  import {computed, onMounted, reactive, ref, watch} from "vue";
  import {useGeolocation} from "@/map/GeolocationFuctions";
  import StationCard from "@/components/StationCard";

  const {coords} = useGeolocation()
    const currPos = computed(() => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude
    }))

    const state = reactive({dialogText:"", dialog:false});

    const stationProp = defineProps({
      id: String,
    })

    const mapDiv = ref(null)
    let map = ref(null)

    onMounted(async () => {
      map.value = new google.maps.Map(mapDiv.value, {
        center: currPos.value,
        zoom: 13,
        mapId: "16c023e99af33056",
      })
    })

  StationService.getStation().then(
    (response) => {
      var stations = response.data
      // const availabilityTag = document.createElement("div");

      stations.forEach(station => {
        // if (station.usedSpaces !== station.maxSpaces) {
        //   availabilityTag.className = "availability-tag available";
        // } else {
        //   availabilityTag.className = "availability-tag unavailable";
        // }
        //
        // availabilityTag.textContent = station.usedSpaces + "/" + station.maxSpaces;
        //
        // availabilityTag.id = station._id
        new google.maps.Marker({
          position: new google.maps.LatLng(station.latitude, station.longitude),
          // content: availabilityTag,
          label: ""+ station.usedSpaces,
          map:map.value
        }).addListener("click", () => {
          state.dialog = true
          state.dialogText = station._id
        })
      })
    })

  var locationMarker = null;
  var locationMarkerIsSet = false;

  watch([currPos], () => {
    map.value.setCenter(currPos.value)
    map.value.setZoom(15)
    if(locationMarkerIsSet){
      console.log("inside the location isSet")
      locationMarker.setMap(null);
    }
    locationMarkerIsSet = true;
    locationMarker= new google.maps.Marker({
      position: new google.maps.LatLng(currPos.value),
      map:map.value,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      }
    })
  })

</script>

<style>
</style>

