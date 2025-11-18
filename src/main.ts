import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/main.scss'
import { Toaster } from 'vue-sonner'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('Toaster', Toaster)
app.mount('#app')
