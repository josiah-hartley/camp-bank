import Vue from 'vue'
import App from './App.vue'
import VueFirestore from 'vue-firestore';
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false

Vue.use(VueFirestore);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
