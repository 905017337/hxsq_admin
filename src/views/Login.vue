<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form ref="userForm" :model="user" status-icon :rules="rules">
        <div class="title">京墨</div>
        <el-form-item prop="username">
          <el-input type="text" prefix-icon="user" v-model="user.username" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="view"
            v-model="user.password"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import storage from "./../utils/storage";
import utils from "../utils/utils";
export default {
  name: "login",
  data() {
    return {
      user: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$api.login(this.user).then(async (res) => {
            console.log(res);
            this.$store.commit("Authorization", res.token);
            this.$store.commit("saveUserInfo", res.userInfo);
            await this.loadAsyncRoutes();
            this.$router.push("/welcome");
          });
        } else {
          return false;
        }
      });
    },
    async loadAsyncRoutes() {
      let Authorization = storage.getItem("Authorization") || {};
      if (Authorization.token) {
        try {
          let menuList = await this.$api.getMenuList();
          let routes = utils.generateRoute(menuList);
          const modules = import.meta.glob("../views/*.vue");
          routes.map((route) => {
            let url = `../views/${route.component}.vue`;
            route.component = modules[url];
            this.$router.addRoute("home", route);
          });
        } catch (error) {
          console.log(error);
        }
      }
    },
    goHome() {
      this.$router.push("/welcome");
    },
  },
};
</script>

<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;
  .modal {
    width: 500px;
    padding: 50px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title {
      font-size: 50px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>