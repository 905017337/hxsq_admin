/**
 * 环境配置封装
 * 
 */
const env = import.meta.env.MODE || 'prod';
const EnvConfig = {
    dev: {
        baseApi: 'http://127.0.0.1:9001/jm',
        mockApi: 'https://www.fastmock.site/mock/7a77d4c032c8ce307967c567ec35b637/api'
    },
    test: {
        baseApi: '//test.futurefe.com/api',
        mockApi: 'https://www.fastmock.site/mock/7a77d4c032c8ce307967c567ec35b637/api'
    },
    prod: {
        baseApi: '//futurefe.com/api',
        mockApi: ''
    },
}


export default {
    env,
    mock: true,
    namespace: 'manager',
    ...EnvConfig[env]
}