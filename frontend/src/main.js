/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'
import store from './store'
import router from './router'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

const SOCKET_PORT = process.env.SOCKET_DOCKER_PORT || 3001;

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import vuetify from './plugins/vuetify'

const app = createApp(App)

registerPlugins(app)

app
  .use(vuetify)
  .use(router)
  .use(store)
  .use(new VueSocketIO({
      debug: true,
      connection: SocketIO(`http://localhost:${SOCKET_PORT}`),
      vuex: {
        store,
        actionPrefix: "SOCKET_",
        mutationPrefix: "SOCKET_"
      }
    })
  )
.mount('#app')
