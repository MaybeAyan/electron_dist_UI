import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import 'tdesign-vue-next/es/style/index.css'
import './assets/tailwindcss/index.css'
import './assets/tailwindcss/preflight.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
