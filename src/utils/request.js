/**
 * axios 二次封装
 */
import axios from "axios"
import config from "./../config"
import { ElMessage } from 'element-plus'
import router from './../router'
import storage from './storage'
const TOKEN_INVALID = "token认证失败，请重新登录"
const NETWORK_ERROR = "网络异常"
//创建axios 实例对象 全局配置
const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000

})

//请求拦截
service.interceptors.request.use((req) => {
    //TO-DO
    const headers = req.headers;
    const token = storage.getItem('Authorization').token || {};
    if (!headers.token) headers.token = 'Bearer ' + token
    return req;
})

//响应拦截
service.interceptors.response.use((res) => {
    const { code, data, msg } = res.data;
    if (code === 200 || code === 0 ) {
        return data;
    } else if (code === 40001) {
        //登录过期，重新登录
        ElMessage.error(TOKEN_INVALID)
        setTimeout(() => {
            router.push('/login')
        }, 15000)
        return Promise.reject(TOKEN_INVALID)
    } else {
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)
    }
})

/**
 * 请求核心函数
 * @param {*} options 请求配置 
 * @returns 
 */
function request(options) {
    options.method = options.method || 'get'
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data;
    }
    if (typeof options.mock != 'undefined') {
        config.mock = options.mock;
    }
    if (config.dev === 'prod') {
        service.defaults.baseURL = config.baseApi
    } else {
        service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
    }
    return service(options)
}

['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
    request[item] = (url, data, options) => {
        return request({
            url,
            data,
            method: item,
            ...options
        })
    }
})

export default request;