import AuthService from '../services/auth.service';
const user = JSON.parse(localStorage.getItem('user'));
console.log(user)
const initialState = user
  ? { status:  user.status , user }
  : { status:  "free", user: null };

export const userState = {
  namespaced: true,
  state: initialState,
  actions: {
    goToReservedStatus({commit}){
      commit('toReservedStatus')
    },
    goToConnectedStatus({commit}){
      commit('toConnectedStatus')
    },
    goToFreeStatus({commit}){
      commit('toFreeStatus')
    }
  },
  mutations: {
    toReservedStatus(state){
      state.status = "reserved";
    },
    toConnectedStatus(state){
      state.status = "connected";
    },
    toFreeStatus(state){
      state.status = "free";
    }
  }
};
