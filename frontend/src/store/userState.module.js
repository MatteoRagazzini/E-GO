import AuthService from '../services/auth.service';
const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const userState = {
  namespaced: true,
  state: initialState,
  actions: {
    startcharge({commit}){
      console.log(user)
      commit('startedCharging')
    }
  },
  mutations: {
    startedCharging(state){
      state.status.isCharging = true;
    }
  }
};
