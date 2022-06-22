/**
 * api管理
 */
import request from "../utils/request"

let admin = '/jm-admin-service'
let authority = '/jm-authority-center'
let web = 'web'
export default {
    login(params) {
        return request({
            url: authority + '/authority/token',
            method: 'post',
            data: params,
            mock: false
        })
    },
    noticeCount(params) {
        return request({
            url: '/leave/count',
            method: 'get',
            data: {},
            mock: true
        })
    },
    getMenuList(params) {
        return request({
            url: admin + '/t-menu/list',
            method: 'get',
            data: params,
            mock: false
        })
    },
    getPermissionList() {
        return request({
            url: '/users/getPermissionList',
            method: 'get',
            data: {},
            mock: false
        })
    },
    getUserList(params) {
        return request({
            url: admin + '/t-user/list',
            method: 'get',
            data: params,
            mock: false
        })
    },
    getAllUserList() {
        return request({
            url: admin + '/t-user/all/list',
            method: 'get',
            data: {},
            mock: false
        })
    },
    userDel(params) {
        return request({
            url: '/users/delete',
            method: 'post',
            data: params,
            mock: true
        })
    },
    userAdd(params) {
        return request({
            url: '/users/add',
            method: 'post',
            data: params,
            mock: true
        })
    },
    getRoleAllList() {
        return request({
            url: '/roles/allList',
            method: 'get',
            data: {},
            mock: true
        })
    },
    getDeptList(params) {
        return request({
            url: '/dept/list',
            method: 'get',
            data: params,
            mock: true
        })
    },
    userSubmit(params) {
        return request({
            url: '/users/operate',
            method: 'post',
            data: params,
            mock: true
        })
    },
    menuAdd(params) {
        return request({
            url: admin + '/menu/add',
            method: 'post',
            data: params,
            mock: false
        })
    },
    menuDel(params) {
        return request({
            url: admin + '/menu/del',
            method: 'post',
            data: params,
            mock: false
        })
    },
    menuUpdate(params) {
        return request({
            url: admin + '/menu/update',
            method: 'post',
            data: params,
            mock: false
        })
    },
    getRoleList(params) {
        return request({
            url: '/role/list',
            method: 'get',
            data: params,
            mock: true
        })
    },
    roleAdd(params) {
        return request({
            url: '/role/add',
            method: 'post',
            data: params,
            mock: true
        })
    },
    roleDelete(params) {
        return request({
            url: '/role/delete',
            method: 'post',
            data: params,
            mock: true
        })
    },
    roleupdate(params) {
        return request({
            url: '/role/update',
            method: 'post',
            data: params,
            mock: true
        })
    },
    deptCreate(params) {
        return request({
            url: '/dept/create',
            method: 'post',
            data: params,
            mock: true
        })
    },
    deptdel(params) {
        return request({
            url: '/dept/del',
            method: 'post',
            data: params,
            mock: true
        })
    }
}