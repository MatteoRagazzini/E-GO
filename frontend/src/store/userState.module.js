import AuthService from '../services/auth.service';
const user = JSON.parse(localStorage.getItem('user'));
console.log(user)
const initialState = user
  ? { status:  user.status , station: user.occupiedStationId }
  : { status:  "free", station: null };

export const userState = {
  namespaced: true,
  state: initialState,
  actions: {
    goToReservedStatus({commit}, station_id){
      commit('toReservedStatus', station_id)
    },
    goToConnectedStatus({commit}, station_id){
      commit('toConnectedStatus', station_id)
    },
    goToFreeStatus({commit}){
      commit('toFreeStatus')
    },
    refreshStatus({commit}, status){
      commit('refresh', status)
    }
  },
  mutations: {
    toReservedStatus(state, station_id){
      state.status = "reserved";
      state.station = station_id
    },
    toConnectedStatus(state, station_id){
      state.status = "connected";
      state.station = station_id
    },
    toFreeStatus(state){
      state.status = "free";
    },
    refresh(state, newState){
      // this is a walk around to the fact that store is resetting everytime I refresh
      state.status = newState.status;
      state.station = newState.station;
    }
  }
};
