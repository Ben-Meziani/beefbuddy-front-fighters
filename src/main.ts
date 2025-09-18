import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import store from './store'
import { configureAxiosSecurity } from '@/utils/security'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import routes from './router/routes'
import { createRouter, createWebHistory } from 'vue-router'

// 🔒 Configuration de la sécurité Axios
configureAxiosSecurity()

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(store).component('VueDatePicker', VueDatePicker).use(router).mount('#app')
