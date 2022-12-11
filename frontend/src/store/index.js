import { createStore } from "vuex";
import { auth } from "./auth.module";
import {LocationStore} from "@/store/LocationStore";

const store = createStore({
  modules: {
    auth,
    LocationStore,
  },
});

export default store;
