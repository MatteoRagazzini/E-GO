
import { reactive } from 'vue'

export const LocationStore = reactive({
  namespaced: true,
  state () {
    return {
      currPos: null,
      center: {lat: 48.137154, lng: 11.576124},
      searchedPos: null,
    }
  },
})


