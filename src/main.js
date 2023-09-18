import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from '@/router/index.js'
import './router/routerbefore.js'

createApp(App).use(router).mount('#app')
