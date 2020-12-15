// Main Imports
import axios from 'axios'
import App from './App.vue'
import store from './store'
import vSelect from 'vue-select'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'
import './plugins/fontawesome'

// Page imports
import Home from './components/pages/Home.vue'

// Register components and modules
Vue.use(VueAxios, axios)
Vue.use(VueRouter)
Vue.component('v-select', vSelect)

// Register Pages
Vue.component('Home', Home)

Vue.config.productionTip = false

Vue.prototype.$EventBus = new Vue()
Vue.prototype.$token = 'eyJ2ZXIiOiIyIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYiLCJraWQiOiIwelBZNHk5WWh1Yk5iMWFMc3p5Q1JJVDlDeFhqR045WlFSdVdNMWV3T053In0.eyJzdWIiOiJiZC1hZG1pbiIsInNjcCI6ImFwcGxpZWQtcGVybWlzc2lvbnNcL2FkbWluIGFwaToqIiwiYXVkIjoiamZydEAqIiwiaXNzIjoiamZmZUAwMDAiLCJpYXQiOjE2MDAwODExNTUsImp0aSI6IjcwZTRiNTFmLTc3MDAtNDBkZS1hMGJmLWVlNDBmYmZlYTQ0NCJ9.Ci_mFbmURlmHoRoYKE7tAGfMXWyuDOXtm17_GeccFK-wN98Y8ZeXEOiweB7whIWEUxxt20ftoSEnGzCntDkMcZ392Jard_R5gihgxBXBQ3IJbxDHxIKJ0WMcTjlCIYGmONe0n3fsp9-jp35gkOhHKUbP71cKq5O_wnADIgzVriuPCy29Mego1Rt-qm8kJQL_ek39PmG0cWZ-rke0MEm99sRHsRuHXGMFOUSyHwye9nhDtiEnRfdFR_lG26hyzhCB_I4uOvNDn4ru7zpRSI96R55n0sNR8zLAB-YuVVYnTMUgKTR1qzQRopyPUJyWsloLh9s3XUtlLXebQImLso9Nng'

// Define routes
const routes = [
  // Private Pages
  { path: '/', name: 'Home', component: Home, public: true }
]

// Create router for pages and apps.
const router = new VueRouter({
  routes
})

// Set global base URL for requests
if (process.env.NODE_ENV === 'development') {
  Vue.axios.defaults.baseURL = 'http://localhost:8080'
}

// Handle Authentication check before each page.
router.beforeEach((to, from, next) => {

  // Public Pages and wheter current page is public.
  const public_pages = ['/']
  const auth_required = !public_pages.includes(to.path)

  // Retrieve user token from storage and retrieval time.
  const token = localStorage.getItem('token')

  // If user hasn't logged in and auth required.
  if (auth_required && !token) {
    return next('/')
  }

  // // Set global token for requests.
  // Vue.axios.defaults.headers.common = {
  //   'x-access-token': localStorage.getItem('token'),
  //   'Access-Control-Allow-Origin': '*'
  // }

  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
