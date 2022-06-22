/**
 * Vuex 状态管理
 */
import { createStore } from 'vuex'
import mutations from './mutations'
import storage from './../utils/storage'

const state = {
    userInfo: storage.getItem("userInfo") || {}, // 获取用户信息
    menuList: storage.getItem("menuList"),
}
const Authorization = {
    Authorization: "" || storage.getItem("Authorization")  //获取token
}
export default createStore({
    Authorization,
    state,
    mutations
})