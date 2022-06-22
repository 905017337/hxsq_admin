import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Storage from './utils/storage'
import request from './utils/request'
import api from './api'
import store from './store'
import { Edit, Delete } from '@element-plus/icons-vue'
import * as ELIcons from '@element-plus/icons-vue'

console.log("环境变量=>", import.meta.env)
const app = createApp(App)
app.config.globalProperties.$storage = Storage
app.config.globalProperties.$api = api
app.config.globalProperties.$request = request
app.component('edit', Edit)
app.component('delete', Delete)
for (let iconName in ELIcons) {
    app.component(iconName, ELIcons[iconName])
}
app.use(router).use(store).use(ElementPlus, { size: 'small' }).mount('#app')
