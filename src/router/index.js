import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import storage from '../utils/storage'
import Api from './../api'
import utils from '../utils/utils'

const routes = [
    {
        name: 'home',
        path: '/',
        meta: {
            title: '首页'
        },
        component: Home,
        redirect: '/welcome',
        children: [
            {
                name: 'welcome',
                path: '/welcome',
                meta: {
                    title: '欢迎体验'
                },
                component: () => import('@/views/Welcome.vue')
            },

        ]
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: '登录页面'
        },
        component: () => import('@/views/Login.vue')
    },
    {
        name: '404',
        path: '/404',
        meta: {
            title: '页面不存在'
        },
        component: () => import('@/views/404.vue')
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

async function loadAsyncRoutes() {
    let Authorization = storage.getItem("Authorization") || {};
    if (Authorization.token) {
        try {
            let menuList = await Api.getMenuList();
            console.log("22222");
            console.log(menuList);
            let routes = utils.generateRoute(menuList);
            console.log(routes);
            const modules = import.meta.glob('../views/*.vue')
            routes.map((route) => {
                let url = `../views/${route.component}.vue`;
                route.component = modules[url];
                console.log(route);
                router.addRoute("home", route);
            });
        } catch (error) {
            console.log(error);
        }
    }
}
//判断当前地址是否可以访问
await loadAsyncRoutes();

//路由守卫
router.beforeEach((to, from, next) => {
    if (to.name) {
        if (router.hasRoute(to.name)) {
            document.title = to.meta.title;
            next()
        } else {
            next('/404')
        }
    } else {
        loadAsyncRoutes()
        let curRoute = router.getRoutes().filter(item => item.path == to.path)
        if (curRoute?.length) {
            document.title = curRoute[0].meta.title;
            next({ ...to, replace: true })
        } else {
            next('/404')
        }
    }

})
export default router