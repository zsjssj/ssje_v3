import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import './assets/styles/index.scss'
// import './assets/styles/arcgis.css'
import '@arcgis/core/assets/esri/themes/light/main.css'
import router from './router'

createApp(App).use(router).mount('#app')
