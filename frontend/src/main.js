/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'
import store from './store'
import router from './router'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import vuetify from './plugins/vuetify'
import VueGoogleMaps from '@fawmi/vue-google-maps'

const app = createApp(App)

registerPlugins(app)

app
  .use(vuetify)
  .use(router)
  .use(store)
  //.use(VueGoogleMaps, {
    //load: {
     // key: 'AIzaSyD3C3y44zQkaTFoaVzuQRW8a2g6-11Q1tI',
      // language: 'de',
     // libraries: "places"
   // },
  //})
.mount('#app')
