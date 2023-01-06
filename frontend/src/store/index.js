import { createStore } from "vuex";
import { auth } from "./auth.module";
import {userState} from "@/store/userState.module";

const store = createStore({
  modules: {
    auth,
    userState
  },
});

export default store;
