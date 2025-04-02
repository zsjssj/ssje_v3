import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import './styles/global.scss'
// import './assets/styles/arcgis.css'
// import '@arcgis/core/assets/esri/themes/light/main.css'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
