import {onMounted, onUnmounted, ref} from "vue";
import MapService from "@/services/map.service";
import axios from "axios";

export function useGeolocation(){
    const coords = ref({latitude:0, longitude: 0})
    let error = ref("")
    let addressPromise = ref("null")
    const isSupported = 'navigator' in window && 'geolocation' in navigator

  let watcher = null
  onMounted(()=>{
    if(isSupported)
      watcher = navigator.geolocation.watchPosition(
        position => {
          coords.value = position.coords;
          // const addressPromise = axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," +  position.coords.longitude + "&key=AIzaSyD3C3y44zQkaTFoaVzuQRW8a2g6-11Q1tI")
        }
      )
  })
  onUnmounted(()=>{
    if(watcher) navigator.geolocation.clearWatch(watcher)
  })

  // return{coords, isSupported, addressPromise}
  return{coords, isSupported}
}


// I was not able to return the promise

// function getAddressFromCoords(coords){
//   let address;
//   let error;
//   axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coords.lat + "," +  coords.lng + "&key=AIzaSyD3C3y44zQkaTFoaVzuQRW8a2g6-11Q1tI").then(response=>{
//     if(response.data.error_message){
//       error = response.data.error_message
//     }else{
//       address =  response.data.results[0].formatted_address;
//       console.log(address)
//     }
//   }).catch(e =>{
//      error=  e.message;
//     })
//
//   return address
// }
