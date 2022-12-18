import {onMounted, onUnmounted, ref} from "vue";

const GeoCoords = ref(null)
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
