
import { reactive } from 'vue';
import StationService from "@/services/station.service";

export const LocationStore = reactive({
  namespaced: true,
  state () {
    return {
      currPos: null,
      center: {lat: 48.137154, lng: 11.576124},
      searchedPos: null,
      stations: null,
    }
  },
  mutations: {
    changeCenter(state, payload) {
      this.state.center = payload;
    }
  },
  actions: {
    changeCenter({
                commit
              }, payload) {
      commit('changeCenter', payload)
    },
  },
  getters: {
    center: state => state.center,
  },

})


