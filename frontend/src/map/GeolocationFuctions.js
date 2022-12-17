import {onMounted, onUnmounted, ref} from "vue";
const GeoCoords = ref({latitude:44.22505599693137, longitude:12.04029382072501})
const coords = ref({latitude:48.1351253, longitude: 11.5819806})
export function useGeolocation(){
  const isSupported = 'navigator' in window && 'geolocation' in navigator

  let watcher = null
  onMounted(()=>{
    if(isSupported)
      watcher = navigator.geolocation.watchPosition(
        position => (GeoCoords.value = position.coords)
      )
  })
  onUnmounted(()=>{
    if(watcher) navigator.geolocation.clearWatch(watcher)
  })

  return{coords: coords, isSupported, GeoCoords: GeoCoords}
}

export function changeLocation(newPosition){
  console.log(newPosition)
  // coords.value = newPosition
  coords.value = {latitude:newPosition.lat, longitude:newPosition.lng}
}

export function setGeoLocation(){
  coords.value = GeoCoords.value;
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
