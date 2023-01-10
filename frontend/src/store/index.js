import { createStore } from "vuex";
import { auth } from "./auth.module";
import {userState} from "@/store/userState.module";
import createPersistedState from "vuex-persistedstate";

const dataState = createPersistedState({
  paths:['initialState']
})

const store = createStore({
  modules: {
    auth,
    userState
  },
  // plugins:[dataState, createPersistedState]
  plugins:[createPersistedState()]
});

export default store;
