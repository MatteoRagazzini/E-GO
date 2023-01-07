import AuthService from '../services/auth.service';
const user = JSON.parse(localStorage.getItem('user'));
console.log(user)
const initialState = user
  ? { status:  user.status , station: user.occupiedStation }
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
    }
  }
};
