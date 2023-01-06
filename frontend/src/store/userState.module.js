import AuthService from '../services/auth.service';
const user = JSON.parse(localStorage.getItem('user'));
console.log(user)
const initialState = user.isChargingAVehicle
  ? { status: { isCharging: true }, user }
  : { status: { isCharging: false }, user: null };

export const userState = {
  namespaced: true,
  state: initialState,
  actions: {
    startedCharging({commit}){
      console.log(initialState)
      commit('startedCharging')
    },
    endedCharge({commit}){
      console.log(initialState)
      commit('endedCharge')
    }
  },
  mutations: {
    startedCharging(state){
      state.status.isCharging = true;
    },
    endedCharge(state){
      state.status.isCharging = false;
    }
  }
};
