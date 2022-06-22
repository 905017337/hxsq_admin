/**
 * mutations 业务层数据交互
 */
import storage from "./../utils/storage";

export default {
    saveUserInfo(state, userInfo) {
        state.userInfo = userInfo;
        storage.setItem('userInfo', userInfo)
    },
    saveMenuList(state, menuList) {
        state.menuList = menuList;
        storage.setItem('menuList', menuList)
    },
    Authorization(state, Authorization) {
        state.Authorization = Authorization;
        storage.setItem('Authorization', Authorization)
    }
}